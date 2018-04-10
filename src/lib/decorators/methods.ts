import { MetaDati, getMeta, ClassType } from '../metaDati';
import { Ruoli } from '../../shared/Ruoli';
import 'reflect-metadata';

function methodDecoratorFactory(
  method: string, url: string, middleware: ClassType[], endMiddleware: ClassType[]) : MethodDecorator {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    const meta: MetaDati = getMeta(target);
    meta.routes[key] = { ...meta.routes[key],
      method,
      url,
      middleware,
      endMiddleware };
    return descriptor;
  };
}

export function Post(url: string, middleware?: ClassType[], endMiddleware?: ClassType[]) {
  return methodDecoratorFactory('post', url, middleware || [], endMiddleware || []);
}

export function Get(url: string, middleware?: ClassType[], endMiddleware?: ClassType[]) {
  return methodDecoratorFactory('get', url, middleware || [], endMiddleware || []);
}

export function Put(url: string, middleware?: ClassType[], endMiddleware?: ClassType[]) {
  return methodDecoratorFactory('put', url, middleware || [], endMiddleware || []);
}

export function Delete(url: string, middleware?: ClassType[], endMiddleware?: ClassType[]) {
  return methodDecoratorFactory('delete', url, middleware || [], endMiddleware || []);
}

export function Secured(authorizedGroup: Ruoli[]): MethodDecorator {
  return (target: any, key, descriptor) => {
    const meta: MetaDati = getMeta(target);
    meta.routes[key] = {
      ...meta.routes[key],
      authorizedGroup };
    return descriptor;
  };
}

export function Deprecated(): MethodDecorator {
  return (target: Object, key: PropertyKey, descriptor: PropertyDescriptor) => {
    console.log(`WARN: ${key} is DEPRACATED!!!`);
    return descriptor;
  };
}


export function decorateProviders(target: any, services: any[]) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    console.log('Decoratore Providers Invocato');
    /* types conterrà le funzioni che ho passato al COSTRUTTORE */
    const types = Reflect.getMetadata('design:paramtypes', target);
    // https://stackoverflow.com/questions/13952870/regular-expression-to-get-parameter-list-from-function-definition
    const argomenti = /\(\s*([^)]+?)\s*\)/.exec(constructor.toString());
    let args: string[] = [];
    if (argomenti && argomenti[1]) {
      args = argomenti[1].split(/\s*,\s*/);
    }
    /*
    Una volta presi gli argomenti in args, mappo i tipi e verifico che il tipo i-esimo del costruttore sia uno dei servizi passato al Provider
    */
    types.map((parameter:any, index: number) => {
      // verifico che il service del @Provider sia uguale al parametro che ho nel costruttore
      const exist = services.filter(service => service.name === parameter.name);
      // Se il servizio del provider è un tipo dei parametri del costruttore...

      if (exist.length === 1) {
        target.prototype.meta.inject = [
          ...target.prototype.meta.inject,
          {
            prop: args[index],
            class: exist[0],
          }];
      } else {
        throw new Error(` NullInjectorError: No provider for ${parameter.name}`);
      }
    });
  };
}

export function Providers(providers: any[]) {
  return (target: any) => {
    const meta = getMeta(target.prototype);
    meta.providers = {
      ...meta.providers,
      ...providers,
    };
    // console.log(target.prototype.meta);
    return decorateProviders(target, providers)(target);
  };
}


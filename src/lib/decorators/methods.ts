import { ExpressMeta, getMeta, Type } from '../metaDati';
import { Ruoli } from '../../shared/Ruoli';

function methodDecoratorFactory(
  method: string, url: string, middleware: Type[], endMiddleware: Type[]) : MethodDecorator {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    const meta: ExpressMeta = getMeta(target);
    meta.routes[key] = { ...meta.routes[key],
      method,
      url,
      middleware,
      endMiddleware };
    console.log(meta);
    return descriptor;
  };
}

export function Post(url: string, middleware?: Type[], endMiddleware?: Type[]) {
  return methodDecoratorFactory('post', url, middleware || [], endMiddleware || []);
}

export function Get(url: string, middleware?: Type[], endMiddleware?: Type[]) {
  return methodDecoratorFactory('get', url, middleware || [], endMiddleware || []);
}

export function Put(url: string, middleware?: Type[], endMiddleware?: Type[]) {
  return methodDecoratorFactory('put', url, middleware || [], endMiddleware || []);
}

export function Delete(url: string, middleware?: Type[], endMiddleware?: Type[]) {
  return methodDecoratorFactory('delete', url, middleware || [], endMiddleware || []);
}

export function Secured(authorizedGroup: Ruoli[]): MethodDecorator {
  return (target: any, key, descriptor) => {
    console.log('SERCURED DECORATOR Invocato');
    const meta: ExpressMeta = getMeta(target);
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

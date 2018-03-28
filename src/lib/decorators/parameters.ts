import { Request, Response, NextFunction } from 'express';
import { ParameterType, ExpressMeta, getMeta, ParameterConfiguration } from '../metaDati';

export function paramDecoratorFactory(type: ParameterType) {
  return function (name?: string): ParameterDecorator {
    return function (target: any, methodName: string | symbol, index: number) {
      const meta: ExpressMeta = getMeta(target);
      /*
      Per ogni metodo mi costruisco la lista dei parametri: RES, REQ, NEXT, BODY, PARAMS...
      Questo mi serve per la apply/call che farò nell'handler del metodo che passo all'oggetto
      Router di Express!
      */
      if (meta.params[methodName] === undefined) {
        meta.params[methodName] = [];
      }
      meta.params[methodName].push({ index, type, name });
    };
  };
}

export const Req = paramDecoratorFactory(ParameterType.REQUEST);

export const Res = paramDecoratorFactory(ParameterType.RESPONSE);

export const Next = paramDecoratorFactory(ParameterType.NEXT);

export const Param = paramDecoratorFactory(ParameterType.PARAMS);

export const Body = paramDecoratorFactory(ParameterType.BODY);

export function getParam(source: any, paramType: string | null, name: string | undefined): any {
  const param = paramType ? source[paramType] : source;

  return name ? param[name] : param;
}

export function extractParameters(
  req: Request, res: Response, next: NextFunction, params: ParameterConfiguration[]): any[] {
  const args: any[] = [];
  if (!params || !params.length) {
    return [req, res, next];
  }
  for (const { name, index, type } of params) {
    switch (type) {
      case ParameterType.RESPONSE:
        args[index] = res;
        break;
      case ParameterType.REQUEST:
        args[index] = req; // getParam(req, null , name);
        break;
      case ParameterType.NEXT:
        args[index] = next;
        break;
      case ParameterType.PARAMS:
        /* Il name sarà il nome del parametro passato ad esempio id */
        args[index] = getParam(req, 'params', name);
        break;
      case ParameterType.BODY:
        args[index] = getParam(req, 'body', name);
        break;
    }
  }
  return args;
}

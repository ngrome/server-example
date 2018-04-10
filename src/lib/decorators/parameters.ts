import { Request, Response, NextFunction } from 'express';
import { TipiParametri, MetaDati, getMeta, ParameterConfiguration } from '../metaDati';

export function paramDecoratorFactory(type: TipiParametri) {
  return function (name?: string): ParameterDecorator {
    return function (target: any, methodName: string | symbol, index: number) {
      const meta: MetaDati = getMeta(target);
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

export const Req = paramDecoratorFactory(TipiParametri.REQUEST);

export const Res = paramDecoratorFactory(TipiParametri.RESPONSE);

export const Next = paramDecoratorFactory(TipiParametri.NEXT);

export const Param = paramDecoratorFactory(TipiParametri.PARAMS);

export const Body = paramDecoratorFactory(TipiParametri.BODY);

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
      case TipiParametri.RESPONSE:
        args[index] = res;
        break;
      case TipiParametri.REQUEST:
        args[index] = req; // getParam(req, null , name);
        break;
      case TipiParametri.NEXT:
        args[index] = next;
        break;
      case TipiParametri.PARAMS:
        /* Il name sarà il nome del parametro passato ad esempio id */
        args[index] = getParam(req, 'params', name);
        break;
      case TipiParametri.BODY:
        args[index] = getParam(req, 'body', name);
        break;
    }
  }
  return args;
}

import { Type, Middleware } from './metaDati';
import { Request, NextFunction, Response } from 'express';
import { Ruoli } from '../shared/Ruoli';

export function middlewareHandler(middleware: Type) {
  return function (...args: any[]): any {
    const instance: Middleware = new middleware();
    console.log('INSTANCE Middleware:', instance);
    return instance.use.apply(instance, args);
  };
}

export function authorizationHandler(authorization: Ruoli[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    console.log('AUTORIZZAZIONI', authorization);
    if (!authorization) {
      next();
    } else {
      console.log('USER', req.user.roles);
      const isOk = authorization.filter((auth) => {
        console.log(req.user.roles.indexOf(auth));
        return req.user.roles.indexOf(auth) >= 0 ? true : false;
      });
      console.log('isOk:', isOk);
      if (!isOk || isOk.length === 0) {
        next('Not Authorized');
      } else {
        next();
      }
    }

  };
}

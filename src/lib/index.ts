import express, { Application, Router, RequestHandler, Request, Response } from 'express';
import { Type, ExpressClass, ExpressMeta, getMeta, Route } from './metaDati';
import { extractParameters } from './decorators/parameters';
import { authorizationHandler, middlewareHandler } from './handlers';
import { NextFunction } from 'express-serve-static-core';
declare global {
  namespace express {
    interface IRouterMatcher{
      'asd': 1;
      [key:string]: any;
    }
  }
}


export function useController(app: Application | Router, controllers: Type[]) {
  controllers.map((controller: Type) => registerControllerRoutes(app, controller));
}

function registerControllerRoutes(app: Application | Router, controllerToRegister: Type) {
  const controller: ExpressClass = getController(controllerToRegister);
  const meta: ExpressMeta = getMeta(controller);
  const router : Router & {
    [key: string]: any;
  } = express.Router();
  const routes = meta.routes;
  const url = meta.url;
  const params = meta.params;
  /*
  Per ogni controller vado a prendermi il Metodo definiti nel meta.routes.
  Ad esempio SecurityController: login, definito nelle meta.routes che costruisco in fase di decorazione con il @Controller
  */
  for (const methodName of Object.keys(routes)) {
    /*
    Per un dato controller e per un metodo, avrò una route:
    (method, url, middleware, endmiddleware)
    */
    const route: Route = routes[methodName];

    /*
     il routeHandler è una funzione di tipo RequestHandler definita in Express del tipo (req, res, next) => {}
    */
    const routeHandler = (req: Request, res: Response, next: NextFunction) => {
      /*
      la extractParameters mi serve per prelevare eventuali parametri decorati per estrarre
      informazioni dal BODY, PARAMS, QUERY STRING o HEADER
      */
      const args = extractParameters(req, res, next, params[methodName]);

      /*
      handler è il metodo del controller i-esimo della for-of a cui applico gli args che ho appena estratto
      */
      const handler = controller[methodName].apply(controller, args);
      return handler;
    };

    const routeAuth = authorizationHandler(route.authorizedGroup);

    const routeMiddleware: RequestHandler[] = (route.middleware || [])
      .map(middleware => middlewareHandler(middleware));

    const endMiddleware: RequestHandler[] = (route.endMiddleware || [])
      .map(middleware => middlewareHandler(middleware));

    /*
    router di Express: router.get(...)
    Al metodo, per la url, applico i vari Middleware, Auth, Handler e EndMiddleware
    */
    const metodo: string = route.method;
    router[metodo].apply(router, [
      route.url, routeMiddleware, routeAuth, routeHandler, endMiddleware]);

  }

  app.use(url, router);

}



function getController(Controller: Type): ExpressClass {
  // Prendilo da un Container o istanzialo
  return new Controller();
}

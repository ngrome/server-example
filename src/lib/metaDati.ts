import express, { Request, Response, NextFunction } from 'express';
import { Ruoli } from '../shared/Ruoli';

export enum TipiParametri {
  REQUEST = 1,
  RESPONSE,
  NEXT,
  PARAMS,
  BODY,
}

export interface MetaDati {
  url: string;
  middleware: ClassType[];
  routes: {
    [key: string]: Route;
  };
  providers: any[]; // Elenco dei servizi che effettuo con @Providers
  inject: any[]; // Array di oggetti che mappa il parametro del costruttore con la classe del servizio e che istanzio dalla libreria
  params: {
    [key: string]: ParameterConfiguration[];
  };
  [index: string]: any;
}

export interface ExpressClass extends ClassType{
  meta?: MetaDati;
  [index: string]: any;
}

export function getMeta(target: ExpressClass): MetaDati {
  if (!target.meta) {
    // Aggancio al target gli express meta:
    target.meta = {
      url: '',
      middleware: [],
      routes: {},
      providers: [],
      inject: [],
      params: {} };
  } else {
    // console.log('META Express presenti:', target.meta);
  }

  return target.meta;
}

export interface ParameterConfiguration {
  index: number;
  type: TipiParametri;
  name?: string;
  data?: any;
}

export interface Route {
  method: string;
  url: string;
  authorizedGroup: Ruoli[];
  middleware: ClassType[];
  endMiddleware: ClassType[];
  [key: string]: any;
}

export interface ClassType extends Function {
  new (...args: any[]): any;
}

export interface Middleware {
  action(request: Request, response: Response, next: NextFunction): void;
}

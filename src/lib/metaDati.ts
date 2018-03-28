import express, { Request, Response, NextFunction } from 'express';
import { Ruoli } from '../shared/Ruoli';

export enum ParameterType {
  REQUEST = 1,
  RESPONSE,
  NEXT,
  PARAMS,
  BODY,
}

export interface ExpressMeta {
  url: string;
  middleware: Type[];
  routes: {
    [key: string]: Route;
  };
  params: {
    [key: string]: ParameterConfiguration[];
  };
  [index: string]: any;
}

export interface ExpressClass {
  __express_meta__?: ExpressMeta;
  [index: string]: any;
}

export function getMeta(target: ExpressClass): ExpressMeta {
  if (!target.__express_meta__) {
    // Aggancio al target gli express meta:
    target.__express_meta__ = {
      url: '',
      middleware: [],
      routes: {},
      params: {} };
  } else {
    // console.log('META Express presenti:', target.__express_meta__);
  }

  return target.__express_meta__;
}


export interface ParameterConfiguration {
  index: number;
  type: ParameterType;
  name?: string;
  data?: any;
}

export interface Route {
  method: string;
  url: string;
  authorizedGroup: Ruoli[];
  middleware: Type[];
  endMiddleware: Type[];
  [key: string]: any;
}


export interface Type extends Function {
  new (...args: any[]): any;
}

export interface Middleware {
  use(request: Request, response: Response, next: NextFunction): void;
}

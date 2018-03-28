import { ExpressMeta, getMeta, Type } from '../metaDati';

export function Controller(basePath: string, middleware?: Type[]): ClassDecorator {
  return function (target: any) {
    const meta: ExpressMeta = getMeta(target.prototype);
    meta.url = basePath;
    meta.middleware = middleware || [];
  };
}

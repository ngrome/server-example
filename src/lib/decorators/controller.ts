import { MetaDati, getMeta, ClassType } from '../metaDati';
import { decorateProviders } from './methods';

interface IController {
  basePath: string;
  providers?: any[];
}

export function Controller(opt: string | IController, middleware?: ClassType[]): ClassDecorator {
  return function (target: any) {
    const meta: MetaDati = getMeta(target.prototype);
    meta.url = typeof opt === 'string' ? opt : opt.basePath;
    meta.middleware = middleware || [];
    if (typeof opt !== 'string' && opt.providers) {
      meta.providers = opt.providers;
      decorateProviders(target, opt.providers)(target);
    }
    // console.log('META CONTROLLER', JSON.stringify(meta, null, 4));
  };
}

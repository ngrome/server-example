import { Hero } from '../models/Hero';
import { heroModel } from '../db/schema';
import { Deprecated } from '../lib/decorators/methods';
import { Service } from './Service';

export class HeroService extends Service {
  @Deprecated()
  insert(hero: Hero) : Promise<Hero> {
    const promise = new Promise<any>((resolve, reject) => {
      heroModel.create(hero, (err: any, saved: Hero) => {
        if (err) { reject(err); }
        else { resolve(saved); }
      });
    });
    return promise;
  }
}

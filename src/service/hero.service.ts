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

  findDocument<Hero>(query: {} = {}, maxRows: number = 0)
  : Promise<Hero[]> {
    return super.findDocument(query, maxRows, heroModel);
  }

  findDocumentById<Hero>(idUser: string) : Promise<Hero | null> {
    return super.findDocumentById<Hero>(idUser, heroModel);
  }

  createDocument<Hero>(newHero: Hero) : Promise<Hero | null> {
    return super.createDocument<Hero>(newHero, heroModel);
  }

  updateDocument<Hero>(updatedHero: Hero) : Promise<Hero | null> {
    return super.updateDocument<Hero | null>(updatedHero, heroModel);
  }

  removeDocument<Hero>(id: string) : Promise<boolean> {
    return super.removeDocument(id, heroModel);
  }
}

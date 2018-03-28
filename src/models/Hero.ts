import { Document } from 'mongoose';
import { HeroBase } from './base/HeroBase';
import { heroModel } from '../db/schema';

export interface Hero extends HeroBase<Document> {
  surname: string;
}
export function addCustomField() {
  heroModel.schema.add({ surname: String });
}




















// ignora sotto


interface Engine {
  increment: any;
}
interface Dati <T extends Engine> {
  cavalli: string;
}

interface Car<T extends Engine> extends Dati<T> {
}

const c: Car<Document> = {
  cavalli: '199',
};


import mongoose, { Document } from 'mongoose';
import { HeroBase } from './base/HeroBase';
import { heroModel } from '../db/schema';

export interface Hero extends HeroBase<Document> {
  surname: string;
  user: string; // id profilo utente
}
export function addCustomField() {
  heroModel.schema.add({
    surname: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
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


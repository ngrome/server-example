import { Document } from 'mongoose';
import { UserBase } from './base/UserBase';
import { userModel } from '../db/schema';

export interface User extends UserBase<Document> {
  surname: string;
}
export function addCustomField() {
  // userModel.schema.add({ surname: String });
}


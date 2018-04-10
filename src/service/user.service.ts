import { User } from '../models/User';
import { userModel } from '../db/schema';
import { Service } from './Service';
import * as bcrypt from 'bcryptjs';
import { Deprecated } from '../lib/decorators/methods';

export class UserService extends Service {
  constructor() {
    super();
    console.log('>>>NEW USER SERVICE<<<');
  }

  @Deprecated()
  insert(user: User) : Promise<User | null> {
    const promise = new Promise<any>((resolve, reject) => {
      userModel.create(user, (err: any, saved: User) => {
        if (err) { reject(err); }
        else { resolve(saved); }
      });
    });
    return promise;
  }

  findDocument<User>(query: {} = {}, maxRows: number = 0)
  : Promise<User[]> {
    return super.findDocument(query, maxRows, userModel);
  }

  findDocumentById<User>(idUser: string) : Promise<User | null> {
    return super.findDocumentById<User>(idUser, userModel);
  }

  createDocument<User>(newUser: User) : Promise<User| null> {
    return super.createDocument<User>(newUser, userModel);
  }

  updateDocument<User>(updatedUser: User) : Promise<User | null> {
    return super.updateDocument<User | null>(updatedUser, userModel);
  }

  removeDocument<User>(idUser: string) : Promise<boolean> {
    return super.removeDocument(idUser, userModel);
  }

  comparePassword(password: string, candidatePassword: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      bcrypt.compare(candidatePassword, password, (err, success) => {
        if (err) return reject(err);
        return resolve(success);
      });
    });
  }
}

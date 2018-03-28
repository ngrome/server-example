import mongoose from 'mongoose';

export interface MongoDocument {
  id?: string;
}
/*tslint:disable:max-line-length*/
interface IRead<T> {
  findById: (id: string, callback: (error: any, result: T | null) => void) => void;
  findOne(cond?: Object, callback?: (err: any, res: T | null) => void): mongoose.Query<mongoose.Document | null>;
  find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<mongoose.Document[]| null>;
}

interface IWrite<T> {
  create: (item: T, callback: (error: any, result: any) => void) => void;
  update: (id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
  delete: (id: string, callback: (error: any, result: any) => void) => void;
}

export class BaseModel<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this.model = schemaModel;
  }

  create(item: T, callback: (error: any, result: T) => void) {
    this.model.create(item, callback);
  }

  update(id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this.model.update({ _id: id }, item, callback);
  }

  delete(id: string, callback: (error: any, result: any) => void) {
    this.model.remove({ _id: this.toObjectId(id) }, err => callback(err, null));
  }

  findById(id: string, callback: (error: any, result: T | null) => void) {
    this.model.findById(id, callback);
  }

  findOne(cond?: Object, callback?: (err: any, res: T | null) => void): mongoose.Query<mongoose.Document | null> {
    return this.model.findOne(cond, callback);
  }

  find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<mongoose.Document[] | null> {
    return this.model.find(cond, options, callback);
  }

  private toObjectId(id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(id);
  }
}

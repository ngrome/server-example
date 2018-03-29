import mongoose, { Model, MongooseDocument } from 'mongoose';

export class Service{

  findDocument<T>(
    query: {} = {}, maxRows: number = 0, model: mongoose.Model<any>) : Promise<T[]> {
    const promise = new Promise<T[]>((resolve, reject) => {
      console.log(query);
      model.find(query).sort({ createdAt: -1 }).limit(maxRows).exec((err: any, res: any) => {

        if (err) { reject(err); }
        else { resolve(res); }
      });
    });

    return promise;
  }

  findDocumentById<T>(id: string, model: mongoose.Model<any>) : Promise<T | null> {
    return this.findDocument({ _id: id }, 1, model)
    .then(res => res[0])
    .catch(err => err);
  }

  createDocument<T>(data: T, model: mongoose.Model<any>) : Promise<T> {
    const promise = new Promise<any>((resolve, reject) => {
      model.create(data, (err: any, saved: T) => {
        if (err) { reject(err); }
        else { resolve(saved); }
      });
    });
    return promise;
  }

  updateDocument<T>(updatedData: any, model: mongoose.Model<any>) : Promise<T | null> {
    const promise = new Promise<T | null>((resolve, reject) => {
      model.findOneAndUpdate({ _id: updatedData.id }, updatedData, (err, document) => {
        if (err) {
          throw err;
        }
        if (!document) {
          reject();
        } else {
          resolve(document);
        }
      });
    });
    return promise;
  }

  removeDocument<T>(id: string, model: mongoose.Model<any>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      model.findOneAndRemove({ _id: id }).exec((err, document) => {
        if (err) {
          throw err;
        }
        if (!document) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

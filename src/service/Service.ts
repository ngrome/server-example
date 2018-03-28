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
      this.findDocument({ _id: updatedData.id }, 1, model).then((result) => {
        const documentUpdated = updatedData;
        documentUpdated.save((err: any, res: any) => {
          if (err) { reject(err.message); }
          else { resolve(res); }
        });
      });
    });
    return promise;
  }

  removeDocument<T>(id: string, model: mongoose.Model<any>): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      // TO-DO
    });
  }
}

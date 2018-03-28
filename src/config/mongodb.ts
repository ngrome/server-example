import mongoose, { Mongoose } from 'mongoose';
import { config } from './';

let dbURI: string;

switch (process.env.NODE_ENV || config.server.ENV) {
  case 'test':
    dbURI = config.mongodb.mongoURI.web;
    break;
  case 'production':
    dbURI = config.mongodb.mongoURI.prod;
    break;
  default:
    dbURI = config.mongodb.mongoURI.dev;
}

export const initdb = (callback: (db:Promise<void>) => void) => {
  const db: Promise<void> = mongoose.connect(dbURI).then(() => {
    console.log('MongoDB è connesso');
  }).catch((e) => {
    console.error(`Errore connessione MongoDB: ${e.message}`);
  });

  mongoose.connection.on('error', (err) => {
    if (err.message.indexOf('ECONNREFUSED') !== -1) {
      console.error('Error: The server was not able to reach MongoDB.\nMaybe it\'s not running?');
      process.exit(1);
    } else {
      throw err;
    }
  });
  callback(db);
};

// Se il processo cade, chiude la connessione
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.debug('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

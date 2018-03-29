import express, { Application, Request, Response } from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { apiError } from './controller/Errors.controller';
import { config } from './config';
import { User } from './models/User';

// TODO: to be deep dive
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export default function server() {

  const app:Application = express();

  app.use((req, res, next) => {
    /*tslint:disable:max-line-length*/
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
    res.header('Access-control-allow-methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next();
    }
  });

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ Page: 'Home Page' });
    res.end();
  });

  app.use(config.server.API, routes(app));
  app.use(apiError);
  app.use((req, res, next) => {
    res.status(404).json({ message:'API RICHIESTA NON TROVATA!' });
  });
  app.listen((process.env.PORT || config.server.PORT), () => {
    console.log(`Server is Up on ${(process.env.PORT || config.server.PORT)} ENV: ${(process.env.NODE_ENV || config.server.ENV)}`);
  });
}

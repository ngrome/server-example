import { Router, Response as Res, Request as Req, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config';
import { Middleware } from '../lib/metaDati';


export class VerifyJWTToken implements Middleware{
  public use(req: Req, res: Res,next: NextFunction): void {
    console.log('verify jwt');

    const token = req.headers.authorization;
    if (typeof token === 'string') {
      const p = verifyJWT(extractFromBearer(token), res);
      p.then((user) => {
        req.user = {
          ...req.user,
          ...user,
        };
        next();
      });
    } else {
      res.status(403).send({ success:false,  message:'No token provided' });
    }
  }
}

export class GetBodyToken implements Middleware{
  public use(req: Req, res: Res,next: NextFunction): void {
    const token = req.body.token;
    if (typeof token === 'string') {
      const p = verifyJWT(extractFromBearer(token), res);
      p.then((user) => {
        req.user = {
          ...req.user,
          ...user,
        };
        next();
      });
    } else {
      res.status(403).send({ success:false,  message:'No token provided' });
    }
  }
}

export class isAdmin implements Middleware {
  public use(req: Req, res: Res,next: NextFunction): void {
    if (typeof req.headers.authorization === 'string') {
      const p = verifyJWT(req.headers.authorization, res);
      p.then((decoded) => {
        const ruoli: string[] = decoded['roles'];
        if (ruoli.map(ruolo => ruolo === 'ADMIN')) {
          next();
        } else {
          res.status(403).send({ success:false,  message:'Permessi insufficienti' });
        }
      });
    } else {
      res.status(403).send({ success:false,  message:'Permessi insufficienti' });
    }

  }
}

export class GenerateToken implements Middleware{

  public use(req: Req, res: Res,next: NextFunction): void {
    console.log('GENERATE TOKEN');
    req.user = req.user || {};
    const user = {
      id: req.user.id,
      mail: req.user.mail,
      username: req.user.username,
      name: req.user.name,
      surname: req.user.surname,
      roles: req.user.roles,
    };
    res.setHeader('Authorization', jsonwebtoken.sign(
      user, config.server.SECRET_JWT, { expiresIn: config.server.EXPIRES_JWT }));
    next();
  }
}

export class SendToken implements Middleware{
  public use(req: Req, res: Res,next: NextFunction): void {
    req.user = req.user || {};
    res.status(200).json({
      token: res.getHeader('Authorization'),
      id: req.user.id,
      username: req.user.username,
      password: req.user.password,
      mail: req.user.mail,
      name: req.user.name,
      surname: req.user.surname,
      roles: req.user.roles});
  }
}

function verifyJWT(token: string, res: Res): Promise<any> {
  const p = new Promise<any>((resolve, reject) => {
    jsonwebtoken.verify(token, config.server.SECRET_JWT, (err, decoded: any) => {
      if (err) {
        res.status(403).send(
          { success:false, message:'Failed to authenticate token' });
      } else {
        const usr = {
          id: decoded['id'] || undefined,
          mail: decoded['mail'] || undefined,
          username: decoded['username'],
          password: decoded['password'],
          name: decoded['name'],
          surname: decoded['surname'],
          roles: decoded['roles'],
          iat: decoded['iat'],
          exp: decoded['exp']};
        resolve(usr);
      }
    });

  });
  return p;
}

function extractFromBearer(token: string) {
  return token.includes('Bearer', 0) ? token.substr(7) : token;
}

import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../lib/metaDati';

export class checkEmail implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Email',
      request.body.email || request.body.mail))
}

export class checkUsername implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Username',
      request.body.username || request.body.usr))
}

export class checkPassword implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Password',
      request.body.password || request.body.psw))
}

export class checkToken implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Title',
      request.headers.authorization || request.body.authorization))
}

export class checkTitle implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Title',
      request.body.title || request.body.titolo))
}

export class checkFilmMaker implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Regista',
      request.body.filmMaker || request.body.regista))
}

export class checkName implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Regista',
      request.body.name || request.body.firstName))
}

export class checkSurname implements Middleware{
  public use = (
    request: Request,
    response: Response,
    next: NextFunction): void => next(check(
      'Regista',
      request.body.surname || request.body.lastName))
}

function check(param: string, value: string) {
  if (!value) {
    return {
      success: false,
      message: `Manca il ${param}`,
    };
  }
  return;
}

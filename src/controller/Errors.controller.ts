import { Request, Response, RequestHandler, ErrorRequestHandler, NextFunction } from 'express';

export function apiError(err: any,req: Request,res: Response,next: NextFunction) {
  console.error(`Gestore Errore API invocato per l'errore ${err}`);
  res.status(500).json({success: false, message: {
    errorCode: 'ERR-001',
    message: 'Internal Server Error',
    detail: err,
  }});
}

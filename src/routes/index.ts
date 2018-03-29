import express, { Application } from 'express';
import { initdb } from '../config/mongodb';
// import { attachControllers } from '@decorators/express';
import { useController } from '../lib';

import * as ctrl from '../controller';

export default function router(app: Application) {
  const router = express.Router();

  initdb((db: Promise<void>) => {
    useController(router, [ctrl.UserController]);
    // useController(router, [ctrl.SecurityController, ctrl.TokenController]);
    useController(router, [ctrl.AuthenticationController]);
    useController(router, [ctrl.HeroController]);
  });

  return router;
}

import { Request as Req, Response as Res, NextFunction } from 'express';
import { GenerateToken, SendToken } from '../middleware/JWT';
import { Controller } from '../lib/decorators/controller';
import { Post } from '../lib/decorators/methods';
import { Req as Request, Res as Response, Next } from '../lib/decorators/parameters';

@Controller('')
export class TokenController {

  @Post('/login', [GenerateToken, SendToken])
  login(@Request() req: Req, @Response() res: Res, @Next() next: any) {
    next();
  }

  @Post('/register', [GenerateToken, SendToken])
  register(@Request() req: Req,@Response() res: Res) {
  }

}

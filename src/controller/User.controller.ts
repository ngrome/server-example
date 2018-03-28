import { Request as Req, Response as Res, NextFunction } from 'express';
import { Req as Request, Res as Response, Next, Param } from '../lib/decorators/parameters';

import { checkEmail, checkPassword } from '../middleware/checkRequest';
import { isAdmin, VerifyJWTToken } from '../middleware/JWT';
import { MongoDocument } from '../models/Model';
import { UserService } from '../service/user.service';
import { User } from '../models/User';
import { Controller } from '../lib/decorators/controller';
import { Post, Get, Delete, Put } from '../lib/decorators/methods';

@Controller('/Users')
export class UserController {

  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Post('', [checkEmail, checkPassword])
  async createUser(@Request() req: Req,@Response() res: Res) {

    const data: User = {
      id: '',
      name: req.body.name,
      surname: req.body.surname,
      mail: req.body.mail,
      password: req.body.password,
      username: req.body.username,
      roles:  req.body.roles,
    };
    const account: User = await this.userService.createDocument(data);
    if (account) {
      res.status(201).json({
        message:'Utente creato correttamente!',
        id: account.id,
      });
    } else {
      res.status(400).json({ message:'Impossibile creare l\'utente' });
    }
  }

  @Get('', [VerifyJWTToken])
  async listUsers(@Request() req: Req,@Response() res: Res) {
    try {
      const users: User[] | null =
        await this.userService.findDocument<User>();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ success: false,  message:'Impossibile cercare attori', errors: err });
    }
  }

  @Delete('/:id')
  async deleteUser(@Request() req: Req, @Response() res:Res, @Param('id') id: string) {
    console.log(id);
  }

  @Put('/:id')
  async updateUser(@Request() req: Req, @Response() res:Res, @Param('id') id: string) {
    console.log(id);
  }
}
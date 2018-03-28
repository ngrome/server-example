import { User } from '../models/User';
import { Request as Req, Response as Res, NextFunction } from 'express';
import { Post, Get } from '../lib/decorators/methods';
import { Controller } from '../lib/decorators/controller';
import { Req as Request, Res as Response, Next } from '../lib/decorators/parameters';
import { checkPassword, checkUsername, checkToken } from '../middleware/checkRequest';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config';
import { VerifyJWTToken, GetBodyToken } from '../middleware/JWT';
import { UserService } from '../service/user.service';

@Controller('')
export class SecurityController {

  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Post('/login')
  async login(@Request() req: Req, @Response() res: Res, @Next() next: any) {
    try {
      const user : User = await this.userService
      .findDocument<User>({ username: req.body.username }, 1)
      .then(users => users[0]);
      console.log(user);
      if (user === null) {
        throw 'Utente non trovato';
      } else {
        if (user.password) {
          const success = await this.userService.comparePassword(user.password, req.body.password);
          if (success === false) {
            throw 'Errore di login:' + success;
          }
        }
        req.user = user;
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: 'Not Authorized'  });
    }
  }

  @Post('/verifyToken', [VerifyJWTToken, GetBodyToken])
  async verifyToken(@Request() req: Req,@Response() res: Res, @Next() next: NextFunction) {
    try {
      if (req.user.id) {
        const user: User | null = await this.userService
        .findDocumentById<User>(req.user.id);

        if (!user) throw 'Errore grave Utente non trovato';
        req.user = {
          ...req.user,
          username: user.username,
          password: user.password,
          name: user.name,
          surname: user.surname,
          mail: user.mail,
          roles: user.roles,
        };
        res.status(200).send(req.user);
      }
    } catch (err) {
      res.status(401).json({ message: 'Not Authorized'  });
    }

  }

  @Post('/changePassword', [VerifyJWTToken])
  async changePassword(@Request() req: Req,@Response() res: Res) {
    try {
      if (req.user.id) {
        const user = await this.userService.findDocumentById<User | null>(req.user.id);
        if (!user) throw 'Utente non trovato';
        if (user.password) {
          const success =
          await this.userService.comparePassword(user.password, req.body.passwordOld);
          if (success === false) {
            throw 'Password errate';
          }
          user.password = req.body.passwordNew;
          try {
            const userToUpdate = await this.userService.updateDocument(user);
            if (userToUpdate) {
              res.status(200).json({ success:true,  message:'OK' });
            } else {
              throw 'Impossibile aggiornare utente';
            }
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        throw 'Errore grave nel Token: manca ID';
      }
    } catch (err) {
      res.status(500).json({ message: 'Old password not valid' });
    }

  }
}

import { Request as Req, Response as Res, NextFunction } from 'express';
import { Post, Get, Secured, Providers, Delete, Put } from '../lib/decorators/methods';
import { Controller } from '../lib/decorators/controller';
import { Req as Request, Res as Response, Param, Body } from '../lib/decorators/parameters';
import { Hero, addCustomField } from '../models/Hero';
import { HeroService } from '../service/hero.service';
import { Document } from 'mongoose';
import { Ruoli } from '../shared/Ruoli';
import { VerifyJWTToken } from '../middleware/JWT';

@Providers([HeroService])
@Controller('/heroes')
export class HeroController {

  constructor(private heroService: HeroService) {
    addCustomField();
  }

  @Get('', [VerifyJWTToken])
  @Secured([Ruoli.ADMIN, Ruoli.MODERATOR, Ruoli.REGISTERED])
  async listHeroes(@Request() req: Req,@Response() res: Res) {
    try {
      const heroes: Hero[] | null =
        await this.heroService.findDocument<Hero>({ user: req.user.id });
      res.status(200).json(heroes);
    } catch (err) {
      res.status(400).json({ success: false,  message:'Impossibile trovare eroi', errors: err });
    }
  }

  @Get('/:id', [VerifyJWTToken])
  async getoHero(@Request() req: Req,@Response() res: Res, @Param('id') id: string) {
    try {
      const hero: Hero | null =
        await this.heroService.findDocumentById<Hero>(id);
      res.status(200).json(hero);
    } catch (err) {
      res.status(400).json({ success: false,  message:'Impossibile trovare eroe', errors: err });
    }
  }

  @Post('/', [VerifyJWTToken])
  @Secured([Ruoli.ADMIN, Ruoli.GUEST, Ruoli.MODERATOR, Ruoli.REGISTERED])
  async createHero(@Request() req: Req, @Response() res: Res) {

    const heroData: Hero  = {
      id: '',
      name: req.body.firstName,
      surname: req.body.surname,
      user: req.user.id,
    };
    const hero = await this.heroService.insert(heroData);
    if (hero) {
      res.status(201).json(hero);
    } else {
      res.status(400).json({
        message:'Impossibile creare l\'eroe',
      });
    }
  }

  @Delete('/:id')
  async deleteHero(@Request() req: Req, @Response() res:Res, @Param('id') id: string) {
    try {
      const op = await this.heroService.removeDocument<Hero>(id).then((result) => {
        res.status(200).json({ success: true, message: 'Eroe cancellato' });
      }).catch((err) => {
        res.status(404).json({ success: false, message: 'Eroe non trovato' });
      });
    } catch (err) {
      res.status(400).json({ success: false,  message:'Impossibile cancellare eroe', errors: err });
    }
  }

  @Put('/:id')
  async updateUser(@Request() req: Req, @Response() res:Res, @Param('id') id: string, @Body('hero') hero: Hero) {
    try {
      const updateData = {
        ...hero,
        id,
      };
      console.log('updateDataHero', updateData);
      const op = await this.heroService.updateDocument<Hero>(updateData).then((result) => {
        res.status(200).json({ success: true, message: 'Eroe aggiornato' });
      }).catch((err) => {
        console.log(err);
        res.status(404).json({ success: false, message: 'Eroe non trovato' });
      });
    } catch (err) {
      res.status(400).json({ success: false,  message:'Impossibile aggiornare eroe', errors: err });
    }
  }
}

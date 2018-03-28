import { Request as Req, Response as Res, NextFunction } from 'express';
import { Post, Get, Secured } from '../lib/decorators/methods';
import { Controller } from '../lib/decorators/controller';
import { Req as Request, Res as Response } from '../lib/decorators/parameters';
import { Hero, addCustomField } from '../models/Hero';
import { HeroService } from '../service/hero.service';
import { Document } from 'mongoose';
import { Ruoli } from '../shared/Ruoli';
import { VerifyJWTToken } from '../middleware/JWT';

@Controller('/heroes')
export class HeroController {

  constructor(private heroService: HeroService) {
    this.heroService = new HeroService();
    addCustomField();
  }

  @Post('/', [VerifyJWTToken])
  @Secured([Ruoli.REGISTERED])
  async createHero(@Request() req: Req, @Response() res: Res) {

    const heroData: Hero  = {
      id: '',
      name: req.body.firstName,
      surname: req.body.surname,
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




}

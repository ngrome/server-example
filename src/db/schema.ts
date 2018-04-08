import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Ruoli } from '../shared/Ruoli';

export const dbCodeBattleSchema = {
  schemaHero: new mongoose.Schema({
    name : {
      type: String,
      required: true,
    },
  }),
  schemaUser: new mongoose.Schema({
    username: {
      unique: true,
      type: String,
      trim: true,
      minlength: 4,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    surname: String,
    mail: {
      type: String,
    },
    roles: [Number],
  }),
  // ...Altri schema generati
};

dbCodeBattleSchema.schemaUser.pre('save', function (this: any, next) {
  console.log('SAVE USER');
  if (!this.isModified('password')) return next();
  if (this.password) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

dbCodeBattleSchema.schemaUser.pre('findOneAndUpdate', function (this: any, next) {
  bcrypt.hash(this._update.password, 10, (err, hash) => {
    this._update.password = hash;
    next();
  });
});

interface Model extends Document{}

const heroModel =
mongoose.model<Model>('Hero', dbCodeBattleSchema.schemaHero, 'heroes');
const userModel = mongoose.model<Model>('User', dbCodeBattleSchema.schemaUser, 'users');

export { heroModel, userModel };

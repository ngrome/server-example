import { Document } from 'mongoose';

export interface HeroBase <T extends Document> {
  id: string;
  name: string;
}

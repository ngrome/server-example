import { Document } from 'mongoose';
import { Ruoli } from '../../shared/Ruoli';

export interface UserBase <T extends Document> {
  id: string;
  username: string;
  password: string;
  name?: string;
  surname?: string;
  mail?: string;
  roles: Ruoli[];
}

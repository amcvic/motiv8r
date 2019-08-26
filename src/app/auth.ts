import { User } from './user';

export interface Auth {
  user: User;
  message: string;
  sessionToken: string;
}
import { Character } from './character';
import { User } from './user';

export declare interface Client {
  id: number;
  connectionId: number;
  user: User | null;
  character: Character | null;
  auth: boolean;
}

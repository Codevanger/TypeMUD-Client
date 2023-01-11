import { User } from './user';

export declare interface Character {
  characterId: number;
  name: string;
  location: number;
  user: User;
  level: number;
  experience: number;
  health: number;
  stamina: number;
  mana: number;
  money: number;
  friends: number[];
  skills: number[];
  inventory: number[];
  stats: Stats;
}

export declare interface Stats {
  str: number;
  dex: number;
  vit: number;
  end: number;
  int: number;
  wis: number;
}

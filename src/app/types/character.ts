/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
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

  friends: string;
  skills: string;
  inventory: string;
  stats: string;
}

export class CharacterView {
  constructor(character: Character) {
    this.characterId = character.characterId;
    this.name = character.name;
    this.location = character.location;
    this.user = character.user;
    this.level = character.level;
    this.experience = character.experience;
    this.health = character.health;
    this.stamina = character.stamina;
    this.mana = character.mana;
    this.money = character.money;

    this._friends = character.friends;
    this._skills = character.skills;
    this._inventory = character.inventory;
    this._stats = character.stats;

    this.stats = JSON.parse(this._stats);
    this.friends = JSON.parse(this._friends);
    this.skills = JSON.parse(this._skills);
    this.inventory = JSON.parse(this._inventory);
  }

  public characterId: number;
  public name: string;
  public location: number;
  public user: User;
  public level: number;
  public experience: number;
  public health: number;
  public stamina: number;
  public mana: number;
  public money: number;

  private _friends: string;
  private _skills: string;
  private _inventory: string;
  private _stats: string;

  public stats: Stats;
  public friends: number[];
  public skills: number[];
  public inventory: number[];

  public get maxHealth(): number {
    return Math.floor(
      100 + this.stats.vit * 10 + Math.max(this.stats.vit * 0.5)
    );
  }

  public get maxStamina(): number {
    return Math.floor(
      100 + this.stats.end * 10 + Math.max(this.stats.end * 0.5)
    );
  }

  public get maxMana(): number {
    return Math.floor(
      100 + this.stats.int * 10 + Math.max(this.stats.wis * 0.5)
    );
  }
}

export declare interface Stats {
  str: number;
  dex: number;
  vit: number;
  end: number;
  int: number;
  wis: number;
}

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
  freeStats: number;

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
    this.freeStats = character.freeStats;

    this._stats = character.stats;
    this._skills = character.skills;
    this._inventory = character.inventory;
    this._friends = character.friends;

    this.stats = character.stats ? JSON.parse(character.stats) : null;
    this.skills = character.skills ? JSON.parse(character.skills) : null;
    this.friends = character.friends ? JSON.parse(character.friends) : null;
    this.inventory = character.inventory
      ? JSON.parse(character.inventory)
      : null;

    console.log(this);
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
  public freeStats: number;

  public stats: Stats;
  public friends: Character[];
  public skills: number[];
  public inventory: number[];

  public _stats: string;
  public _friends: string;
  public _skills: string;
  public _inventory: string;

  public get maxHealth(): number {
    return Math.floor(
      100 + this.stats.vit * 10 + Math.max(this.stats.end * 0.5)
    );
  }

  public get healthRegen(): number {
    return Math.floor(this.stats.vit * 2);
  }

  public get healthPercent(): number {
    return +Number(this.health / this.maxHealth).toFixed(2);
  }

  public get maxStamina(): number {
    return Math.floor(
      100 + this.stats.end * 10 + Math.max(this.stats.vit * 0.5)
    );
  }

  public get staminaRegen(): number {
    return Math.floor(this.stats.end * 2);
  }

  public get staminaPercent(): number {
    return +Number(this.stamina / this.maxStamina).toFixed(2);
  }

  public get maxMana(): number {
    return Math.floor(
      100 + this.stats.int * 10 + Math.max(this.stats.wis * 0.5)
    );
  }

  public get manaRegen(): number {
    return Math.floor(this.stats.int * 2);
  }

  public get manaPercent(): number {
    return +Number(this.mana / this.maxMana).toFixed(2);
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

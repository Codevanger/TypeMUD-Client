export declare interface GameLocation {
  id: number;
  name: string;
  description: string;
  exits: Array<number>;
  expandedExits: Array<GameLocation>;
}

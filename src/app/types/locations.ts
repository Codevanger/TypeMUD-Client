export declare type Direction =
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW'
  | 'U'
  | 'D';

export declare interface GameLocation {
  id: number;
  name: string;
  description: string;
  bootstrap: number;
  rooms: Array<GameRoom>;
}

export declare interface GameRoom {
  id: number;
  name: string;
  description: string;
  locationId: number;
  exits: Array<GameExit>;
}

export declare interface GameExit {
  id: number;
  roomId: number;
  locationId?: number;
  direction: Direction;
}

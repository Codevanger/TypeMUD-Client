/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { GameLocation, GameRoom } from '../types/locations';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { StateService } from './state.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class LocationService {
  constructor(
    private wsService: WebsocketService,
    private stateService: StateService
  ) {
    this.initLocationListening();
  }

  public getCurrentLocation(): void {
    if (!this.wsService.connected) {
      return;
    }

    this.wsService.sendMessage('/currentlocation');
  }

  public move(exit: number): void {
    if (!this.wsService.connected) {
      return;
    }

    if (!exit) {
      return;
    }

    this.wsService.sendMessage(`/move ${exit}`);
  }

  private initLocationListening(): void {
    this.wsService.parsedConnection$
      .pipe(
        filter(
          (message) =>
            message.code === TransportCode.MOVED ||
            message.code === TransportCode.MAP_INFO ||
            message.code === TransportCode.LOCATION_INFO ||
            message.code === TransportCode.ROOM_INFO
        )
      )
      .subscribe(
        (
          parsed: TransportMessage<{ location: GameLocation; room: GameRoom }>
        ) => {
          this.stateService.currentRoom = parsed.data.room;
          this.stateService.currentLocation = parsed.data.location;

          this.stateService.character = parsed.initiator.character;
        }
      );

    this.wsService.parsedConnection$
      .pipe(filter((data) => data.code === TransportCode.SELECTED_CHARACTER))
      .subscribe(() => {
        this.getCurrentLocation();
      });
  }
}

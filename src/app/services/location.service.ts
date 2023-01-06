import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { GameLocation } from '../types/locations';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { WebsocketService } from './websocket.service';

@Injectable()
export class LocationService {
  public currentLocation$ = new BehaviorSubject<GameLocation>(null);
  public currentLocation = this.currentLocation$.getValue();

  constructor(private wsService: WebsocketService) {
    this.wsService.parsedConnection$
      .pipe(
        filter(
          (message) =>
            message.code === TransportCode.MOVED ||
            message.code === TransportCode.MAP_INFO
        )
      )
      .subscribe((message: TransportMessage<GameLocation>) => {
        this.currentLocation$.next(message.data);
      });

    this.wsService.parsedConnection$
      .pipe(filter((data) => data.code === TransportCode.CHANGED))
      .subscribe(() => {
        this.getCurrentLocation();
      });
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

    this.wsService.sendMessage(`/move ${exit}`);
  }
}

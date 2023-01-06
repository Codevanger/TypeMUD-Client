import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable()
export class MapService {
  constructor(private wsService: WebsocketService) {}

  public getMap(): void {
    if (!this.wsService.connected) {
        return null;
    }

    this.wsService.sendMessage('/currentlocation');
  }

  public goto(location: number): void {
    if (!this.wsService.connected) {
        return null;
    }

    this.wsService.sendMessage('/move ' + location);
  }
}

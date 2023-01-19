import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable()
export class FriendsService {
  constructor(private wsService: WebsocketService) {}

  public getFriends(): void {
    this.wsService.sendMessage('/friendlist');
  }

  public addFriend(name: string): void {
    this.wsService.sendMessage(`/friendadd ${name}`);
  }

  public removeFriend(name: string): void {
    this.wsService.sendMessage(`/friendremove ${name}`);
  }
}

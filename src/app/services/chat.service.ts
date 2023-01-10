import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Character } from '../types/character';
import { GameLocation } from '../types/locations';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { CharacterService } from './character.service';
import { StateService } from './state.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class ChatService {
  constructor(
    private wsService: WebsocketService,
    private stateService: StateService
  ) {}

  public say(message: string): void {
    this.wsService.sendMessage('/say ' + message);
  }

  public shout(message: string): void {
    this.wsService.sendMessage('/shout ' + message);
  }

  public addMessage(message: string): void {
    this.stateService.chatLog.push(message);
  }
}

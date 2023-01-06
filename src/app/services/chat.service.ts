import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { GameLocation } from '../types/locations';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { CharacterService } from './character.service';
import { LocationService } from './location.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class ChatService {
  public lastMessage$ = new BehaviorSubject<string>('');
  private chatLog$ = new BehaviorSubject<string[]>([]);

  constructor(
    private wsService: WebsocketService,
    private characterService: CharacterService,
    private locationService: LocationService
  ) {
    this.wsService.parsedConnection$
      .pipe(
        filter(
          (message) =>
            message.code === TransportCode.MESSAGE_RECEIVED ||
            message.code === TransportCode.MESSAGE_SENT
        )
      )
      .subscribe((message: TransportMessage<{ message: string }>) => {
        this.chatLog$.next([...this.chatLog$.value, message.data.message]);
        this.lastMessage$.next(message.data.message);
      });

    this.wsService.parsedConnection$
      .pipe(filter((data) => data.code === TransportCode.CHANGED))
      .subscribe((data: TransportMessage<GameLocation>) => {
        console.log(data);

        if (data.message === 'Other character leave from here') {
          this.addMessage(`${data.initiator.character.name} ушёл отсюда.`);
        }

        if (data.message === 'Other character come here') {
          this.addMessage(`${data.initiator.character.name} пришёл сюда.`);
        }
      });
  }

  public get chatLog(): string[] {
    return this.chatLog$.value;
  }

  public say(message: string): void {
    if (!this.wsService.connected) {
      return null;
    }

    this.wsService.sendMessage('/say ' + message);
  }

  public shout(message: string): void {
    if (!this.wsService.connected) {
      return null;
    }

    this.wsService.sendMessage('/shout ' + message);
  }

  public addMessage(message: string): void {
    this.chatLog$.next([...this.chatLog$.value, message]);
  }
}

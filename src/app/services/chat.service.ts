import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Character } from '../types/character';
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
      .subscribe(
        (
          message: TransportMessage<{ message: string; type: 'say' | 'shout' }>
        ) => {
          let action = '';

          if (
            message.initiator.character.id ===
            this.characterService.character.id
          ) {
            action = message.data.type === 'say' ? 'говорите' : 'кричите';
          } else {
            action = message.data.type === 'say' ? 'говорит' : 'кричит';
          }

          const sender =
            message.initiator.character.id ===
            this.characterService.character.id
              ? 'Вы'
              : message.initiator.character.name;

          const readyMessage = `${sender} ${action}: ${message.data.message}`;

          this.chatLog$.next([...this.chatLog$.value, readyMessage]);
          this.lastMessage$.next(readyMessage);
        }
      );

    this.wsService.parsedConnection$
      .pipe(
        filter(
          (parsed) =>
            parsed.code === TransportCode.CHARACTER_LEAVED ||
            parsed.code === TransportCode.CHARACTER_ENTERED
        )
      )
      .subscribe(
        (
          parsed: TransportMessage<{
            location: GameLocation;
            character: Character;
          }>
        ) => {
          if (parsed.code === TransportCode.CHARACTER_LEAVED) {
            this.addMessage(
              `${parsed.initiator.character.name} ушёл отсюда в ${parsed.data.location.name}.`
            );
          }

          if (parsed.code === TransportCode.CHARACTER_ENTERED) {
            this.addMessage(
              `${parsed.initiator.character.name} пришёл сюда из ${parsed.data.location.name}.`
            );
          }
        }
      );
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

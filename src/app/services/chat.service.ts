import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Character } from '../types/character';
import { GameLocation } from '../types/locations';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { CharacterService } from './character.service';
import { WebsocketService } from './websocket.service';
import * as petrovich from 'petrovich';

@Injectable()
export class ChatService {
  public lastMessage$ = new BehaviorSubject<string>('');
  private chatLog$ = new BehaviorSubject<string[]>([]);

  constructor(
    private wsService: WebsocketService,
    private characterService: CharacterService
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
              `${parsed.data.character.name} ушёл отсюда в ${petrovich(parsed.data.location.name,'dative')}.`
            );
          }

          if (parsed.code === TransportCode.CHARACTER_ENTERED) {
            console.log(petrovich);

            this.addMessage(
              `${parsed.data.character.name} пришёл сюда из ${petrovich(parsed.data.location.name, 'dative')}.`
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

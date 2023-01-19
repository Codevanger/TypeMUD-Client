import { Injectable } from '@angular/core';
import { filter } from 'rxjs';
import { TransportCode } from '../types/transport-code';
import { CharacterService } from './character.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class ExperienceService {
  constructor(
    private wsService: WebsocketService,
    private characterService: CharacterService
  ) {
    this.wsService.parsedConnection$
      .pipe(filter((message) => message.code === TransportCode.LEVEL_UP))
      .subscribe((_) => this.characterService.getCurrentCharacter());
  }
}

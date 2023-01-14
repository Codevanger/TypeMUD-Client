import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Stats } from '../types/character';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { CharacterService } from './character.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class StatsService {
  constructor(
    private wsService: WebsocketService,
    private characterService: CharacterService
  ) {
    this.initStatsListening();
  }

  public get statsChanged(): Observable<TransportMessage<null>> {
    return this.wsService.parsedConnection$.pipe(
      filter((message) => message.code === TransportCode.STATS_CHANGED)
    );
  }

  public setStats(stats: Partial<Stats>): void {
    this.wsService.sendMessage(`/changestats ${JSON.stringify(stats)}`);
  }

  private initStatsListening(): void {
    this.statsChanged.subscribe((_: TransportMessage<null>) => {
      this.characterService.getCurrentCharacter();
    });
  }
}

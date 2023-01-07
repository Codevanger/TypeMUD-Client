import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment';
import { Character } from '../types/character';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class CharacterService {
  public character: Character;

  constructor(
    private wsService: WebsocketService,
    private authService: AuthService,
    private locationService: LocationService,
    private http: HttpClient
  ) {
    this.wsService.parsedConnection$
      .pipe(
        filter(
          (message) =>
            message.code === TransportCode.SELECTED_CHARACTER ||
            message.code === TransportCode.CHARACTER_INFO
        )
      )
      .subscribe((parsed: TransportMessage<{ character: Character }>) => {
        this.character = parsed.data.character;
        this.locationService.getCurrentLocation();
      });
  }

  public selectCharacter(characterId: number): void {
    if (!this.wsService.connected) {
      return null;
    }

    if (!this.authService.loggedIn) {
      return null;
    }

    this.wsService.sendMessage('/select ' + characterId);
  }

  public getCurrentCharacter(): void {
    if (!this.wsService.connected) {
      return null;
    }

    if (!this.authService.loggedIn) {
      return null;
    }

    this.wsService.sendMessage('/mycharacter');
  }

  public getAllCharacters(): Observable<Character[]> {
    const apiAdress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `http://${APP_CONFIG.address}`
        : '';

    if (!this.authService.loggedIn) {
      return null;
    }

    return this.http.get<Character[]>(
      apiAdress + '/api/character/user/current'
    );
  }

  public createCharacter(name: string): Observable<Character> {
    const apiAdress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `http://${APP_CONFIG.address}`
        : '';

    if (!this.authService.loggedIn) {
      return null;
    }

    return this.http.post<Character>(
      apiAdress + '/api/character/user/current',
      { name }
    );
  }

  public getCharacter(id: number): Observable<Character> {
    const apiAdress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `http://${APP_CONFIG.address}`
        : '';

    if (!this.authService.loggedIn) {
      return null;
    }

    return this.http.get<Character>(apiAdress + `/api/character/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, pluck, tap } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable()
export class AuthService {
  public token = '';
  public loggedIn = false;
  public loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private wsService: WebsocketService, private http: HttpClient) {}

  public authToWebsocket(token: string): void {
    if (!this.wsService.connected) {
      return null;
    }

    this.wsService.sendMessage(`/auth ${token}`);
  }

  public login(username: string, password: string): Observable<string> {
    if (!this.wsService.connected) {
      return null;
    }

    const apiAdress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `http://${APP_CONFIG.address}`
        : '';

    const login$ = this.http
      .post<{ token: string }>(apiAdress + '/api/auth/login', {
        username,
        password,
      })
      .pipe(
        map((response) => response.token),
        tap((token) => {
          if (!token) {
            return;
          }

          this.token = token;
          this.loggedIn = true;
          this.loggedIn$.next(true);
          this.authToWebsocket(token);
        })
      );

    return login$;
  }
}

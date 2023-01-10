import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from './services/character.service';
import { filter, Observable, of, switchMap, timer } from 'rxjs';
import { Character } from './types/character';
import { ChatService } from './services/chat.service';
import { LocationService } from './services/location.service';
import { GameLocation, GameRoom } from './types/locations';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public displayChat = false;
  public displayMap = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private wsService: WebsocketService,
    private stateService: StateService
  ) {
    console.log('APP_CONFIG', APP_CONFIG);

    const serverAddress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `ws://${APP_CONFIG.address}:${APP_CONFIG.port}`
        : `ws://localhost:${APP_CONFIG.port}`;

    this.wsService.connect(serverAddress);
  }
  public get displayLogin(): boolean {
    return !this.authService.loggedIn;
  }

  public get displayCharacterSelect(): boolean {
    return this.authService.loggedIn && !this.stateService.character;
  }

  public get connected(): boolean {
    return this.wsService.connected;
  }

  public ngOnInit() {
    this.primengConfig.ripple = true;
  }

  public showDialog() {
    this.displayChat = !this.displayChat;
  }

  public showMap() {
    this.displayMap = !this.displayMap;
  }
}

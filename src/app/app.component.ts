import { Component, OnInit } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from './services/character.service';
import { filter, first, map, Observable, of } from 'rxjs';
import { Character } from './types/character';
import { ChatService } from './services/chat.service';
import { LocationService } from './services/location.service';
import { GameLocation } from './types/locations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public displayChat = false;
  public displayExits = false;

  public characters: Character[] = [];
  public talkOptions = [
    {
      label: 'Сказать',
      value: 'say',
    },
    {
      label: 'Крикнуть',
      value: 'shout',
    },
  ];

  public loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(21),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(48),
    ]),
  });

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private characterService: CharacterService,
    private wsService: WebsocketService,
    private chatService: ChatService,
    private locationService: LocationService
  ) {
    console.log('APP_CONFIG', APP_CONFIG);

    this.wsService.connect('ws://localhost:5050');
  }

  public get currentLocation$(): Observable<GameLocation> {
    return this.locationService.currentLocation$.pipe(
      filter((location) => !!location)
    );
  }

  public get displayLogin(): boolean {
    return !this.authService.loggedIn;
  }

  public get displayCharacterSelect(): boolean {
    return this.authService.loggedIn && !this.characterService.character;
  }

  public get connected(): boolean {
    return this.wsService.connected;
  }

  public get messages(): string[] {
    return this.chatService.chatLog;
  }

  public getCharacters(): Observable<Character[]> {
    if (!this.authService.loggedIn) {
      return of([]);
    }

    return this.characterService.getAllCharacters();
  }

  public ngOnInit() {
    this.primengConfig.ripple = true;
  }

  public showDialog() {
    this.displayChat = !this.displayChat;
  }

  public showExits() {
    this.displayExits = !this.displayExits;
  }

  public login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(() => {
        this.characterService.getAllCharacters().subscribe((characters) => {
          this.characters = characters;
        });
      });
  }

  public selectCharacter(characterId: number): void {
    this.characterService.selectCharacter(characterId);
  }

  public createCharacter(characterName: string): void {
    if (!characterName || characterName.length < 3) {
      return;
    }

    this.characterService.createCharacter(characterName).subscribe(() => {
      this.characterService.getAllCharacters().subscribe((characters) => {
        this.characters = characters;
      });
    });
  }

  public sendMessage(
    type: string,
    message: string,
    chatScreen: HTMLDivElement
  ): void {
    if (type && message && message.length > 0) {
      this.chatService[type](message);

      this.chatService.lastMessage$
        .pipe(first())
        .subscribe(() => chatScreen.scrollTo(0, chatScreen.scrollHeight + 50));
    }
  }

  public moveToLocation(exit: number): void {
    this.locationService.move(exit);
  }
}

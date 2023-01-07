import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from './services/character.service';
import {
  debounceTime,
  filter,
  first,
  map,
  Observable,
  of,
  switchMap,
  timer,
} from 'rxjs';
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
  @ViewChild('chatScreen', { static: false })
  public chatScreen: ElementRef<HTMLDivElement>;

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

    const serverAddress =
      APP_CONFIG.address && APP_CONFIG.address !== ''
        ? `ws://${APP_CONFIG.address}:${APP_CONFIG.port}`
        : `ws://localhost:${APP_CONFIG.port}`;

    this.wsService.connect(serverAddress);

    this.chatService.lastMessage$
      .pipe(switchMap(() => timer(100)))
      .subscribe(() => {
        console.log({
          scrollTop: this.chatScreen?.nativeElement?.scrollTop,
          scrollHeight: this.chatScreen?.nativeElement?.scrollHeight,
          chatScreen: this.chatScreen?.nativeElement,
        });

        if (this.chatScreen) {
          this.chatScreen.nativeElement.scrollTo({
            top: this.chatScreen.nativeElement.scrollHeight,
          });
        }
      });
  }

  public get currentLocation$(): Observable<GameLocation> {
    return this.locationService.currentLocation$.pipe(
      filter((location) => !!location)
    );
  }

  public get currentCharacter(): Character {
    return this.characterService.character;
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

  public sendMessage(type: string, messageInput: HTMLInputElement): void {
    if (type && messageInput.value && messageInput.value.length > 0) {
      this.chatService[type](messageInput.value);
      messageInput.value = '';
    }
  }

  public moveToLocation(exit: number): void {
    this.locationService.move(exit);
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { StateService } from '../../services/state.service';
import { Character, CharacterView } from '../../types/character';
import { GameLocation, GameRoom } from '../../types/locations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(private stateService: StateService) {
    this.listenToHotkeys();

    this.character$ = this.stateService.getCharacterView$();
  }

  public character$: Observable<CharacterView>;

  public get currentLocation$(): Observable<GameLocation> {
    return this.stateService.currentLocation$;
  }

  public get currentRoom$(): Observable<GameRoom> {
    return this.stateService.currentRoom$;
  }

  public get canPlay$(): Observable<boolean> {
    return combineLatest([
      this.stateService.character$,
      this.currentLocation$,
      this.currentRoom$,
    ]).pipe(
      map(([character, location, room]) => !!character && !!location && !!room)
    );
  }

  public dockItems = [
    {
      label: 'Карта',
      icon: 'pi pi-map',
      hotkey: 'Alt + M',
      command: () => this.showMap(),
    },
    {
      label: 'Персонаж',
      icon: 'pi pi-user',
      hotkey: 'Alt + P',
      command: () => this.showCharacterInfo(),
    },
    {
      label: 'Инвентарь',
      icon: 'pi pi-box',
      hotkey: 'Alt + I',
      command: () => this.showInventory(),
    },
    {
      label: 'Чат',
      icon: 'pi pi-comments',
      hotkey: 'Alt + C',
      command: () => this.showChat(),
    },
    {
      label: 'Друзья',
      icon: 'pi pi-users',
      hotkey: 'Alt + F',
      command: () => this.showFriends(),
    },
    {
      label: 'Умения',
      icon: 'pi pi-book',
      hotkey: 'Alt + B',
      command: () => this.showSkills(),
    },
  ];

  public showMap(): void {
    this.stateService.showMap = !this.stateService.showMap;
  }

  public showChat(): void {
    this.stateService.showChat = !this.stateService.showChat;
  }

  public showCharacterInfo(): void {
    this.stateService.showCharacterInfo = !this.stateService.showCharacterInfo;
  }

  public showFriends(): void {
    this.stateService.showFriends = !this.stateService.showFriends;
  }

  public showInventory(): void {
    this.stateService.showInventory = !this.stateService.showInventory;
  }

  public showSkills(): void {
    this.stateService.showSkills = !this.stateService.showSkills;
  }

  private listenToHotkeys(): void {
    const hotkeys = {
      M: () => this.showMap(),
      C: () => this.showChat(),
      P: () => this.showCharacterInfo(),
      F: () => this.showFriends(),
    };

    window.addEventListener('keydown', (event) => {
      if (event.altKey && hotkeys[event.key.toUpperCase()]) {
        hotkeys[event.key.toUpperCase()]();
      }
    });
  }
}

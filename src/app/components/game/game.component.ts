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
  }

  public get currentLocation$(): Observable<GameLocation> {
    return this.stateService.currentLocation$;
  }

  public get currentRoom$(): Observable<GameRoom> {
    return this.stateService.currentRoom$;
  }

  public get character$(): Observable<CharacterView> {
    return this.stateService.characterView$;
  }

  public get currentHpPercent$(): Observable<number> {
    return this.stateService.characterView$.pipe(
      map(
        (character) =>
          +Number(character.health / character.maxHealth).toFixed(2)
      )
    );
  }

  public get currentManaPercent$(): Observable<number> {
    return this.stateService.characterView$.pipe(
      map((character) => +Number(character.mana / character.maxMana).toFixed(2))
    );
  }

  public get currentStaminaPercent$(): Observable<number> {
    return this.stateService.characterView$.pipe(
      map(
        (character) =>
          +Number(character.stamina / character.maxStamina).toFixed(2)
      )
    );
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

  private listenToHotkeys(): void {
    const hotkeys = {
      M: () => this.showMap(),
      C: () => this.showChat(),
      P: () => this.showCharacterInfo(),
    };

    window.addEventListener('keydown', (event) => {
      if (event.altKey && hotkeys[event.key.toUpperCase()]) {
        hotkeys[event.key.toUpperCase()]();
      }
    });
  }
}

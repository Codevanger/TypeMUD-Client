/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { combineLatest, debounce, filter, map, Observable } from 'rxjs';
import { StateService } from '../../services/state.service';
import { Character } from '../../types/character';
import { GameLocation, GameRoom } from '../../types/locations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(private stateService: StateService) {}

  public get currentLocation$(): Observable<GameLocation> {
    return this.stateService.currentLocation$;
  }

  public get currentRoom$(): Observable<GameRoom> {
    return this.stateService.currentRoom$;
  }

  public get character$(): Observable<Character> {
    return this.stateService.character$;
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
    },
    {
      label: 'Персонаж',
      icon: 'pi pi-user',
      hotkey: 'Alt + P',
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
    },
    {
      label: 'Друзья',
      icon: 'pi pi-users',
      hotkey: 'Alt + F',
    },
  ];
}

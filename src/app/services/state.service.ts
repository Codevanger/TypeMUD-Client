/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../types/character';
import { GameLocation, GameRoom } from '../types/locations';

@Injectable()
export class StateService {
  private _currentLocation$ = new BehaviorSubject<GameLocation>(null);
  private _currentRoom$ = new BehaviorSubject<GameRoom>(null);

  private _character$ = new BehaviorSubject<Character>(null);

  private _morphLoaded$ = new BehaviorSubject<boolean>(false);

  private _lastMessage$ = new BehaviorSubject<string>('');
  private _chatLog$ = new BehaviorSubject<string[]>([]);

  public get currentLocation$(): Observable<GameLocation> {
    return this._currentLocation$.asObservable();
  }

  public get currentLocation(): GameLocation {
    return this._currentLocation$.value;
  }

  public set currentLocation(location: GameLocation) {
    this._currentLocation$.next(location);
  }

  public get currentRoom$(): Observable<GameRoom> {
    return this._currentRoom$.asObservable();
  }

  public get currentRoom(): GameRoom {
    return this._currentRoom$.value;
  }

  public set currentRoom(room: GameRoom) {
    this._currentRoom$.next(room);
  }

  public get character$(): Observable<Character> {
    return this._character$.asObservable();
  }

  public get character(): Character {
    return this._character$.value;
  }

  public set character(character: Character) {
    this._character$.next(character);
  }

  public get morphLoaded$(): Observable<boolean> {
    return this._morphLoaded$.asObservable();
  }

  public get morphLoaded(): boolean {
    return this._morphLoaded$.value;
  }

  public set morphLoaded(loaded: boolean) {
    this._morphLoaded$.next(loaded);
  }

  public get lastMessage$(): Observable<string> {
    return this._lastMessage$.asObservable();
  }

  public get lastMessage(): string {
    return this._lastMessage$.value;
  }

  public set lastMessage(message: string) {
    this._lastMessage$.next(message);
  }

  public get chatLog$(): Observable<string[]> {
    return this._chatLog$.asObservable();
  }

  public get chatLog(): Array<string> {
    return this._chatLog$.value;
  }

  public set chatLog(log: Array<string>) {
    this._chatLog$.next(log);
  }
}

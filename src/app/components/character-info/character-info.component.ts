/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../../services/state.service';
import { CharacterView } from '../../types/character';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.component.html',
  styleUrls: ['./character-info.component.scss'],
})
export class CharacterInfoComponent {
  public get characterView$(): Observable<CharacterView> {
    return this.stateService.characterView$;
  }

  public get showCharacterInfo(): boolean {
    return this.stateService.showCharacterInfo;
  }

  public set showCharacterInfo(value: boolean) {
    this.stateService.showCharacterInfo = value;
  }

  constructor(private stateService: StateService) {}
}

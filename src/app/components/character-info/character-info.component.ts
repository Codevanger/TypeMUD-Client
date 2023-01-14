/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateService } from '../../services/state.service';
import { StatsService } from '../../services/stats.service';
import { Character, CharacterView } from '../../types/character';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.component.html',
  styleUrls: ['./character-info.component.scss'],
})
export class CharacterInfoComponent {
  constructor(
    private stateService: StateService,
    private statsService: StatsService
  ) {
    this.character$ = this.stateService.getCharacterView$();

    this.statsService.statsChanged.subscribe((stats) => {
      this.spentPoints = 0;
      this.reset();
    });
  }

  public character$: Observable<CharacterView>;
  public spentPoints = 0;

  public statsForm = new FormGroup({
    str: new FormControl(0),
    dex: new FormControl(0),
    vit: new FormControl(0),
    end: new FormControl(0),
    int: new FormControl(0),
    wis: new FormControl(0),
  });

  public get showCharacterInfo(): boolean {
    return this.stateService.showCharacterInfo;
  }

  public set showCharacterInfo(value: boolean) {
    this.stateService.showCharacterInfo = value;
  }

  public updateStats(stat: string): void {
    const formControl = this.statsForm.get(stat);

    if (!formControl) {
      return;
    }

    formControl.setValue(formControl.value + 1);
    this.spentPoints++;
  }

  public reset(): void {
    this.statsForm.reset();
    this.spentPoints = 0;
  }

  public save(): void {
    this.statsService.setStats(this.statsForm.value);
  }
}

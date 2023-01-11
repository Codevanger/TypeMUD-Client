/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() public value: number;
  @Input() public color: string;

  public get progress(): number {
    return this.value * 100;
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Az from '../../../Az/az.js';
import { StateService } from './state.service';

enum Cases {
  nominative = 'nomn',
  genitive = 'gent',
  dative = 'datv',
  accusative = 'accs',
  instrumental = 'ablt',
  prepositional = 'loct',
}

@Injectable()
export class MorphService {
  constructor(private stateService: StateService) {
    Az.Morph.init('./Az/dicts', (err, _) => {
      if (!err) {
        console.log('MorphService: Morph initialized');
      } else {
        throw new Error('MorphService: Morph initialization failed');
      }

      this.stateService.morphLoaded = true;
    });
  }

  public inflect(word: string, caseName: Cases): string {
    if (!this.stateService.morphLoaded) {
      throw new Error('MorphService: Morph not initialized');
    }

    const morphedWord = Az.Morph(word)[0].inflect({
      CAse: caseName,
    } as any).word;

    return morphedWord;
  }
}

import { BehaviorSubject } from 'rxjs';
import * as Az from '../../../Az/az.js';

enum Cases {
  nominative = 'nomn',
  genitive = 'gent',
  dative = 'datv',
  accusative = 'accs',
  instrumental = 'ablt',
  prepositional = 'loct',
}

export class MorphService {
  public morphLoaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    Az.Morph.init('./Az/dicts', (err, _) => {
      if (!err) {
        console.log('MorphService: Morph initialized');
      } else {
        throw new Error('MorphService: Morph initialization failed');
      }

      this.morphLoaded$.next(true);

      console.log(
        this.inflect('Александр', Cases.accusative),
      );
    });
  }

  public inflect(word: string, caseName: Cases): string {
    console.log(caseName);

    if (!this.morphLoaded$.value) {
      throw new Error('MorphService: Morph not initialized');
    }

    console.log(Az.Morph(word)[0]);

    const morphedWord = Az.Morph(word)[0].inflect({ CAse: caseName } as any).word;

    return morphedWord;
  }
}

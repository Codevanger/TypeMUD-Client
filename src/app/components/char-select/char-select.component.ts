/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../types/character';

@Component({
  selector: 'app-char-select',
  templateUrl: './char-select.component.html',
  styleUrls: ['./char-select.component.scss'],
})
export class CharSelectComponent implements OnInit {
  constructor(
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  public newCharacterName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[а-яА-ЯёЁ\s]+$/),
  ]);

  @Input()
  public displayCharSelect = false;

  @Output()
  public displayCharSelectChange = new EventEmitter<boolean>();

  public characters: Character[] = [];

  public ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.getAllCharacters();
      }
    });
  }

  public selectCharacter(characterId: number): void {
    this.characterService.selectCharacter(characterId);
  }

  public createCharacter(): void {
    if (this.newCharacterName.invalid) {
      return;
    }

    this.characterService
      .createCharacter(this.newCharacterName.value)
      .subscribe(() => {
        this.characterService.getAllCharacters().subscribe((characters) => {
          this.characters = characters;
          this.newCharacterName.setValue('');
        });
      });
  }

  private getAllCharacters(): void {
    this.characterService.getAllCharacters().subscribe((characters) => {
      this.characters = characters;
    });
  }
}

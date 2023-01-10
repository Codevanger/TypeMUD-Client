import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
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

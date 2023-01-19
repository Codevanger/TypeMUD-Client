import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { FriendsService } from '../../services/friends.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent {
  constructor(
    private friendsService: FriendsService,
    private stateService: StateService
  ) {
    this.stateService.showFriends$
      .pipe(filter((value) => value))
      .subscribe(() => {
        this.friendsService.getFriends();
      });
  }

  public get showFriends(): boolean {
    return this.stateService.showFriends;
  }

  public set showFriends(value: boolean) {
    this.stateService.showFriends = value;
  }

  public addFriend(name: string): void {
    this.friendsService.addFriend(name);
  }

  public removeFriend(name: string): void {
    this.friendsService.removeFriend(name);
  }
}

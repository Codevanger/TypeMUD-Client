/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(
    private chatService: ChatService,
    private stateService: StateService
  ) {
    this.initMessageListening();
  }

  public talkOptions = [
    {
      label: 'Сказать',
      value: 'say',
    },
    {
      label: 'Крикнуть',
      value: 'shout',
    },
  ];

  public get displayChat(): boolean {
    return this.stateService.showChat;
  }

  public set displayChat(value: boolean) {
    this.stateService.showChat = value;
  }

  @ViewChild('chatScreen', { static: false })
  public chatScreen: ElementRef<HTMLDivElement>;

  public get messages(): string[] {
    return this.stateService.chatLog;
  }

  public sendMessage(type: string, messageInput: HTMLInputElement): void {
    if (type && messageInput.value && messageInput.value.length > 0) {
      this.chatService[type](messageInput.value);
      messageInput.value = '';
    }
  }

  private initMessageListening(): void {
    this.stateService.lastMessage$
      .pipe(switchMap(() => timer(100)))
      .subscribe(() => {
        if (this.chatScreen) {
          this.chatScreen.nativeElement.scrollTo({
            top: this.chatScreen.nativeElement.scrollHeight,
          });
        }
      });
  }
}

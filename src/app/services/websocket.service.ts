import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TransportCode } from '../types/transport-code';
import { TransportMessage } from '../types/transport-message';

@Injectable()
export class WebsocketService {
  public connected$ = new BehaviorSubject<boolean>(false);
  private connection$: WebSocketSubject<string> = webSocket(null);

  public get parsedConnection$(): Observable<TransportMessage> {
    return this.connected$.pipe(
      filter((connected) => connected),
      switchMap(
        () =>
          this.connection$.asObservable() as unknown as Observable<TransportMessage>
      )
    );
  }

  public get connected(): boolean {
    return this.connection$ && !this.connection$.closed;
  }

  public connect(address: string) {
    this.connection$ = webSocket(address);

    this.connection$
      .pipe(
        filter((data) => {
          const parsedData = data as unknown as TransportMessage<null>;
          return parsedData.code === TransportCode.CONNECTED;
        }),
        first()
      )
      .subscribe(() => this.connected$.next(true));

    this.parsedConnection$.subscribe({
      next: (data) => console.log('data: ', data),
      error: (err) => {
        console.log('error: ', err);

        if (err.type === 'close') {
          this.disconnect();
        }
      },
      complete: () => console.log('complete'),
    });
  }

  public disconnect() {
    if (this.connection$) {
      this.connection$.complete();
    }
  }

  public sendMessage(message: string) {
    this.connection$.next(message);
  }
}

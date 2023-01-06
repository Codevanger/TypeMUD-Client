import { Client } from './client';
import { TransportCode } from './transport-code';

export declare interface TransportMessage<T = null> {
  code: TransportCode;
  message: string;
  initiator: Client;
  data: T;
}

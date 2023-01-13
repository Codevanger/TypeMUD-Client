import { Client } from './client';
import { TransportCode } from './transport-code';

export declare interface TransportMessage<T extends object = null> {
  code: TransportCode;
  initiator: Client;
  initiatorType: 'SERVER' | 'CLIENT';
  data: T;
}

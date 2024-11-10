import type { Callback } from './common.js';

export interface WsMessageKind<T, D> {
  type: T;
  data: D;
}

export interface WsCloseFrame {
  code: number;
  reason: string;
}

export type WsMessage =
  | WsMessageKind<'Text', string>
  | WsMessageKind<'Binary', number[]>
  | WsMessageKind<'Ping', number[]>
  | WsMessageKind<'Pong', number[]>
  | WsMessageKind<'Close', WsCloseFrame | null>;

export type WsMessageSend = WsMessage | string | number[];

export interface WsConnectionConfig {
  writeBufferSize?: number;
  maxWriteBufferSize?: number;
  maxMessageSize?: number;
  maxFrameSize?: number;
  acceptUnmaskedFrames?: boolean;
  headers?: HeadersInit;
}

export interface WebSocketImpl {
  readonly id: number;
  addListener(cb: Callback<[WsMessage], unknown>): Callback;
  send(message: WsMessageSend): Promise<void>;
  disconnect(): void;
}

export interface WebSocketCommon {
  connect(url: string, config?: WsConnectionConfig): Promise<WebSocketImpl>;
}

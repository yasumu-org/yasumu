declare namespace Tanxium {
  export function getRuntimeDataString(): string;
  export function getRuntimeData<T extends Record<string, unknown>>(): T;
  export function setRuntimeData<T extends Record<string, unknown>>(data: T): void;

  export const version: {
    deno: string;
    v8: string;
    typescript: string;
    tanxium: string;
  };

  export {};
}

/// <reference path="./_common.d.ts"/>

class Yasumu {
  //   public get version(): string {
  //     return op_yasumu_version();
  //   }
}

Object.defineProperty(globalThis, 'Yasumu', {
  configurable: false,
  writable: false,
  enumerable: true,
  value: new Yasumu(),
});

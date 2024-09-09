/// <reference path="./_common.ts" />

(() => {
  const performance = {
    timeOrigin: Yasumu.nanoseconds(),
    now: () => Yasumu.nanoseconds(),
  };

  Object.assign(globalThis, { performance });
})();

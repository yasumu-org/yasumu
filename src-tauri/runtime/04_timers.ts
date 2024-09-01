(() => {
  const { sleep } = Yasumu;

  type TimerCallback<T extends any[]> = (...args: T) => void;

  let id = 0;

  const timers = new Map<number, Timer>();

  class Timer {
    public readonly id = ++id;

    public constructor(
      public readonly cb: TimerCallback<any[]>,
      public readonly ms: number,
      public readonly args: any[],
    ) {
      timers.set(this.id, this);
    }

    public cancel(): void {
      timers.delete(this.id);
    }

    public once(): void {
      sleep(this.ms)
        .then(() => {
          if (timers.has(this.id)) {
            this.cb(...this.args);
          }
        })
        .finally(() => {
          this.cancel();
        });
    }

    public loop(): void {
      sleep(this.ms)
        .then(() => {
          if (timers.has(this.id)) {
            this.cb(...this.args);
            this.loop();
          }
        })
        .catch(() => {
          this.cancel();
        });
    }
  }

  function setTimeout<T extends any[]>(callback: TimerCallback<T>, ms: number, ...args: T): number {
    const timer = new Timer(callback, ms, args);

    timer.once();

    return timer.id;
  }

  function clearTimeout(id: number): void {
    const timer = timers.get(id);

    if (timer) {
      timer.cancel();
    }
  }

  function setInterval<T extends any[]>(callback: TimerCallback<T>, ms: number, ...args: T): number {
    const timer = new Timer(callback, ms, args);

    timer.loop();

    return timer.id;
  }

  function clearInterval(id: number): void {
    const timer = timers.get(id);

    if (timer) {
      timer.cancel();
    }
  }

  Object.defineProperties(globalThis, {
    setTimeout: {
      value: setTimeout,
      writable: true,
      configurable: true,
      enumerable: false,
    },
    clearTimeout: {
      value: clearTimeout,
      writable: true,
      configurable: true,
      enumerable: false,
    },
    setInterval: {
      value: setInterval,
      writable: true,
      configurable: true,
      enumerable: false,
    },
    clearInterval: {
      value: clearInterval,
      writable: true,
      configurable: true,
      enumerable: false,
    },
  });
})();

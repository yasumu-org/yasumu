/// <reference path="./_common.ts" />

(() => {
  const isTestEnvironment = Yasumu.isTestEnvironment;

  if (!isTestEnvironment) return;

  const YASUMU_ASSERTION_ERROR = 'YasumuAssertionError';
  const TEST_CONTEXT_THROWAWAY_ERROR = 'TestContextThrowawayError';

  class YasumuAssertionError extends Error {
    public constructor(message: string) {
      super(message);
      this.name = YASUMU_ASSERTION_ERROR;
    }
  }

  class TestContextThrowawayError extends Error {
    public constructor(message: string) {
      super(message);
      this.name = TEST_CONTEXT_THROWAWAY_ERROR;
    }
  }

  class YasumuAssertion<T> implements Assertion<T> {
    constructor(
      private actual: T,
      private readonly negative: boolean = false,
    ) {}

    public get not(): Assertion<T> {
      return new YasumuAssertion<T>(this.actual, !this.negative);
    }

    #throwIf(condition: boolean, message: string, value: any): void {
      if ((condition && !this.negative) || (!condition && this.negative)) {
        throw new YasumuAssertionError(`${message}\n${this.#getDiff(this.actual, value)}`);
      }
    }

    #getDiff(a: any, b: any): string {
      return `+ ${a}\n- ${b}`;
    }

    public toBeUndefined(): void {
      this.#throwIf(this.actual !== undefined, `Expected ${this.actual} to be undefined`, undefined);
    }

    public toHaveOwnProperty(expected: string): void {
      const hasProperty = Object.prototype.hasOwnProperty.call(this.actual, expected);
      this.#throwIf(!hasProperty, `Expected ${this.actual} to have own property ${expected}`, undefined);
    }

    public toHaveOwnPropertyValue(key: string, value: any): void {
      const hasProperty = Object.prototype.hasOwnProperty.call(this.actual, key);
      const valueMatch = (this.actual as any)[key] === value;

      this.#throwIf(!hasProperty, `Expected ${this.actual} to have own property ${key}`, undefined);
      this.#throwIf(!valueMatch, `Expected ${(this.actual as any)[key]} to be ${value}`, value);
    }

    public toBe(expected: T): void {
      this.#throwIf(this.actual !== expected, `Expected ${this.actual} to be ${expected}`, expected);
    }

    public toEqual(expected: T): void {
      this.#throwIf(this.actual != expected, `Expected ${this.actual} to equal ${expected}`, expected);
    }

    public toMatch(expected: RegExp): void {
      this.#throwIf(!expected.test(String(this.actual)), `Expected ${this.actual} to match ${expected}`, expected);
    }

    public toBeTruthy(): void {
      this.#throwIf(!this.actual, `Expected ${this.actual} to be truthy`, true);
    }

    public toBeFalsy(): void {
      this.#throwIf(!!this.actual, `Expected ${this.actual} to be falsy`, false);
    }

    public toBeDefined(): void {
      this.#throwIf(this.actual === undefined, `Expected ${this.actual} to be defined`, undefined);
    }

    public toBeNull(): void {
      this.#throwIf(this.actual !== null, `Expected ${this.actual} to be null`, null);
    }

    public toBeInstanceOf(expected: any): void {
      this.#throwIf(
        !(this.actual instanceof expected),
        `Expected ${this.actual} to be an instance of ${expected}`,
        expected,
      );
    }

    public toBeGreaterThan(expected: number): void {
      this.#throwIf(
        typeof this.actual !== 'number' || this.actual <= expected,
        `Expected ${this.actual} to be greater than ${expected}`,
        expected,
      );
    }

    public toBeLessThan(expected: number): void {
      this.#throwIf(
        typeof this.actual !== 'number' || this.actual >= expected,
        `Expected ${this.actual} to be less than ${expected}`,
        expected,
      );
    }

    public toBeGreaterThanOrEqual(expected: number): void {
      this.#throwIf(
        typeof this.actual !== 'number' || this.actual < expected,
        `Expected ${this.actual} to be greater than or equal to ${expected}`,
        expected,
      );
    }

    public toBeLessThanOrEqual(expected: number): void {
      this.#throwIf(
        typeof this.actual !== 'number' || this.actual > expected,
        `Expected ${this.actual} to be less than or equal to ${expected}`,
        expected,
      );
    }

    public toHaveProperty(expected: string): void {
      this.#throwIf(
        !(typeof this.actual === 'object' && this.actual && expected in this.actual),
        `Expected ${this.actual} to have property ${expected}`,
        expected,
      );
    }

    public toHaveLength(expected: number): void {
      this.#throwIf(
        typeof this.actual === 'object' && this.actual && 'length' in this.actual && this.actual.length !== expected,
        `Expected ${this.actual} to have length ${expected}`,
        expected,
      );
    }
  }

  enum TestState {
    Passed = 'passed',
    Failed = 'failed',
    Skipped = 'skipped',
  }

  function ensureTestEnvironment(): void {
    if (!isTestEnvironment) {
      throw new Error('Yasumu tests can only be performed in test environment');
    }
  }

  function test(name: string, fn: YasumuTest): void {
    ensureTestEnvironment();
    let state: TestState | null = null;
    let stateReason: string | null | undefined = null;

    const testContext: TestContext = {
      skip: (reason?: string) => {
        state = TestState.Skipped;
        stateReason = reason;
        throw new TestContextThrowawayError('Test skipped');
      },
      pass: (reason?: string) => {
        state = TestState.Passed;
        stateReason = reason;
        throw new TestContextThrowawayError('Test passed');
      },
      fail: (reason?: string) => {
        state = TestState.Failed;
        stateReason = reason;
        throw new TestContextThrowawayError('Test failed');
      },
    };

    const formatTime = (duration: number) => {
      if (duration < 1000) return `${duration}ms`;
      return `${(duration / 1000).toFixed(2)}s`;
    };

    const evaluateState = (duration: string) => {
      switch (state) {
        case TestState.Passed:
          console.log(`[PASSED] (${duration}) ${name}: ${state}`);
          break;
        case TestState.Failed:
          console.error(`[FAILED] (${duration}) Yasumu.test(${name}): ${stateReason}`);
          break;
        case TestState.Skipped:
          console.warn(`[SKIPPED] (${duration}) Yasumu.test(${name}): ${stateReason}`);
          break;
        default:
          break;
      }
    };

    let start = Date.now();
    let end;

    try {
      fn(testContext);
      end = Date.now();
      console.log(`[PASSED] (${formatTime(end - start)}) ${name}: ${state || TestState.Passed}`);
    } catch (error) {
      end = Date.now();
      const timeTaken = formatTime(end - start);
      if (error && error instanceof TestContextThrowawayError && state != null) return void evaluateState(timeTaken);

      if (error && error instanceof YasumuAssertionError) {
        console.error(`[FAILED] (${timeTaken}) Yasumu.test(${name}): ${error.message}`);
        return;
      }

      console.error(
        `[ERROR] (${timeTaken}) Yasumu.test(${name}) failed with error: ${(error as Error).message || error}`,
      );
    }
  }

  function expect<T>(actual: T): Assertion<T> {
    ensureTestEnvironment();
    return new YasumuAssertion<T>(actual);
  }

  Object.assign(globalThis, { test, expect });
})();

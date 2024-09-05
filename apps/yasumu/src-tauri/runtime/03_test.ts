/// <reference path="./_common.ts" />

interface TestSuite {
  id: number;
  name: string;
  tests: Test[];
}

interface AssertionResult {
  skipped: boolean;
  passed: boolean;
  failed: boolean;
}

interface Test {
  id: number;
  name: string;
  result: AssertionResult;
  expected: any;
  received: any;
  time: number;
}

interface TestContext {
  skip(): void;
}

(() => {
  function createTestModule() {
    const testSuites: TestSuite[] = [];

    let testIndex = 0;
    let testSuiteIndex = 0;

    function createTestSuite(name: string): TestSuite {
      return {
        id: testSuiteIndex++,
        name,
        tests: [],
      };
    }

    function createTest(name: string): Test {
      return {
        id: testIndex++,
        name,
        result: { skipped: false, passed: false, failed: false },
        expected: null,
        received: null,
        time: 0,
      };
    }

    function describe(name: string, fn: () => void) {
      createTestSuite(name);
      fn();
    }

    function test(name: string, fn: (context: TestContext) => void) {
      const test = createTest(name);

      const start = Date.now();

      try {
        let skipped = false;

        fn({
          skip() {
            skipped = true;
          },
        });

        if (skipped) {
          test.result = { skipped: true, passed: false, failed: false };
          return;
        }

        test.result = { skipped: false, passed: true, failed: false };
      } catch (e) {
        test.result = { skipped: false, passed: false, failed: true };
      }

      const end = Date.now();

      test.time = end - start;

      const suite = testSuites[testSuiteIndex - 1];

      const makeTestName = (suite: TestSuite | undefined, test: Test) => {
        return suite ? `${suite.name} > ${test.name}` : test.name;
      };

      const extractError = (test: Test) => {
        if (test.result.failed) {
          return test.received instanceof Error
            ? test.received.stack
            : `Expected: ${test.expected}\nReceived: ${test.received}`;
        }

        return '';
      };

      if (test.result.failed) {
        console.error(`[${test.time}ms] Test failed: ${makeTestName(suite, test)}\n${extractError(test)}`);
      } else if (test.result.skipped) {
        console.warn(`[${test.time}ms] Test skipped: ${makeTestName(suite, test)}`);
      } else if (test.result.passed) {
        console.log(`[${test.time}ms] Test passed: ${makeTestName(suite, test)}`);
      }
    }

    function expect(received: any) {
      const currentTest = testSuites[testSuiteIndex - 1].tests[testIndex - 1];

      if (!currentTest) {
        throw new Error('No test found');
      }

      currentTest.received = received;

      const assertion = {
        toBe(expected: any) {
          currentTest.expected = expected;
          currentTest.received = received;

          if (expected !== received) {
            throw new Error('Assertion failed');
          }
        },
        toEqual(expected: any) {
          currentTest.expected = expected;
          currentTest.received = received;

          if (JSON.stringify(expected) !== JSON.stringify(received)) {
            throw new Error('Assertion failed');
          }
        },
        toStrictEqual(expected: any) {
          currentTest.expected = expected;
          currentTest.received = received;

          if (Object.is(expected, received)) {
            throw new Error('Assertion failed');
          }
        },
        throws() {
          if (typeof received !== 'function') {
            throw new Error('Assertion failed');
          }

          let passed = false;
          try {
            received();
          } catch {
            passed = true;
          }

          if (!passed) {
            throw new Error('Assertion failed');
          }
        },
        not: {
          toBe(expected: any) {
            currentTest.expected = expected;
            currentTest.received = received;

            if (expected === received) {
              throw new Error('Assertion failed');
            }
          },
          toEqual(expected: any) {
            currentTest.expected = expected;
            currentTest.received = received;

            if (JSON.stringify(expected) === JSON.stringify(received)) {
              throw new Error('Assertion failed');
            }
          },
          toStrictEqual(expected: any) {
            currentTest.expected = expected;
            currentTest.received = received;

            if (!Object.is(expected, received)) {
              throw new Error('Assertion failed');
            }
          },
          throws() {
            if (typeof received !== 'function') {
              throw new Error('Assertion failed');
            }

            let passed = false;
            try {
              received();
            } catch {
              passed = true;
            }

            if (passed) {
              throw new Error('Assertion failed');
            }
          },
        },
      };

      return assertion;
    }

    return { describe, test, expect, it: test };
  }

  Object.defineProperty(Yasumu, 'createTest', {
    value: createTestModule,
    writable: false,
    configurable: false,
    enumerable: false,
  });
})();

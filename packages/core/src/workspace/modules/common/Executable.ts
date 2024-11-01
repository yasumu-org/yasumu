export interface ExecutionOptions {
  preScript?: boolean;
  postScript?: boolean;
  testScript?: boolean;
}

export const LogLevel = {
  Log: 'log',
  Warning: 'warning',
  Error: 'error',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const ScriptType = {
  PreScript: 'pre-script',
  PostScript: 'post-script',
  TestScript: 'test-script',
} as const;

export type ScriptType = (typeof ScriptType)[keyof typeof ScriptType];

export interface ScriptOutput {
  log: string;
  level: LogLevel;
}

export interface ScriptResult {
  type: ScriptType;
  output: ScriptOutput[];
}

export const TestStatus = {
  Passed: 'passed',
  Failed: 'failed',
  Skipped: 'skipped',
} as const;

export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus];

export interface TestSuite {
  id: string;
  name: string;
}

export interface TestEntry {
  suite: TestSuite | null;
  id: string;
  name: string;
  status: TestStatus;
  log: string;
  time: number;
}

export interface TestResult {
  tests: TestEntry[];
}

export interface ExecutionResult {
  preScript: ScriptResult;
  postScript: ScriptResult;
  test: TestResult;
}

/**
 * Represents an entity that can be executed.
 */
export abstract class Executable {
  /**
   * Executes the entity.
   * @param options The execution options.
   */
  public abstract execute(options?: ExecutionOptions): Promise<ExecutionResult>;
}

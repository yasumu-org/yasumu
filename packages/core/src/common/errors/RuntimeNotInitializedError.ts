export class RuntimeNotInitializedError extends Error {
  public readonly name = 'RuntimeNotInitializedError';

  public constructor() {
    super('The JavaScript runtime is not initialized');

    Error.captureStackTrace(this, RuntimeNotInitializedError);
  }
}

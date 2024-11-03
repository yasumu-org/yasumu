export class InvalidLocationError extends Error {
  public readonly name = 'InvalidLocationError';

  public constructor(location: string) {
    super(`The location "${location}" is invalid`);

    Error.captureStackTrace(this, InvalidLocationError);
  }
}

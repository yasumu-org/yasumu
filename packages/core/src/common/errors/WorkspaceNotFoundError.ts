export class WorkspaceNotFoundError extends Error {
  public readonly name = 'WorkspaceNotFoundError';
  public readonly path: string;

  public constructor(path: string) {
    super(`Workspace not found at path: ${path}`);

    this.path = path;

    Error.captureStackTrace(this, WorkspaceNotFoundError);
  }
}

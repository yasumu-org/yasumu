import { COMMAND_BINDINGS } from '@/common/binding.js';

export interface CommandHandlerMock {
  name: string;
  handler: ((...args: any[]) => any) | null;
}

/**
 * Intercepts a command.
 * @example const command = new CommandInterceptor('test');
 * command.intercept(() => {
 *  console.log('test command was intercepted');
 * });
 */
export class CommandInterceptor {
  private data: CommandHandlerMock;

  public constructor(public readonly name: string) {
    if (COMMAND_BINDINGS.has(name)) {
      throw new Error(`Interceptor for command ${name} is already registered`);
    }

    this.data = { name: this.name, handler: null };
  }

  public isRegistered(): boolean {
    return COMMAND_BINDINGS.has(this.name);
  }

  public isIntercepting(): boolean {
    return this.data.handler !== null;
  }

  public intercept(handler: (...args: any[]) => any): this {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    this.data.handler = handler;
    COMMAND_BINDINGS.set(this.name, this);

    return this;
  }

  public unregister(): void {
    COMMAND_BINDINGS.delete(this.name);
  }

  public async invoke(...args: any[]): Promise<any> {
    if (this.data.handler === null) {
      throw new Error('No handler registered');
    }

    const result = await this.data.handler(...args);

    return result;
  }
}

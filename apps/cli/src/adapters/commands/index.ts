import { COMMANDS_REGISTRY } from '../common/store.js';

export interface CommandHandler {
  name: string;
  handler: ((...args: any[]) => any) | null;
}

/**
 * Creates a command handler.
 * @example const command = new YasumuCommand('test');
 * command.intercept(() => {
 *  console.log('test command was intercepted');
 * });
 */
export class YasumuCommand {
  private data: CommandHandler;

  public constructor(public readonly name: string) {
    if (COMMANDS_REGISTRY.has(name)) {
      throw new Error(`Handler for command ${name} is already registered`);
    }

    this.data = { name: this.name, handler: null };
  }

  public isRegistered(): boolean {
    return COMMANDS_REGISTRY.has(this.name);
  }

  public isHandling(): boolean {
    return this.data.handler !== null;
  }

  public handle(handler: (...args: any[]) => any): this {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    this.data.handler = handler;
    COMMANDS_REGISTRY.set(this.name, this);

    return this;
  }

  public unregister(): void {
    COMMANDS_REGISTRY.delete(this.name);
  }

  public async invoke(...args: any[]): Promise<any> {
    if (this.data.handler === null) {
      throw new Error('No handler registered');
    }

    const result = await this.data.handler(...args);

    return result;
  }
}

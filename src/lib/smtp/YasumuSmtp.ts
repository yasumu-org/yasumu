import { invoke } from '@tauri-apps/api/core';
import { Commands } from '../common/commands';

export interface YasumuSmtpOptions {
  port: number;
}

export interface YasumuEmailMessage {
  from: String;
  to: Array<String>;
  subject: String;
  body: String;
}

export class YasumuSmtp {
  private _running = false;
  public readonly EmailChannel = 'new-email';
  public constructor(private options: YasumuSmtpOptions) {}

  public get running() {
    return this._running;
  }

  public getPort() {
    return this.options.port;
  }

  public setPort(port: number) {
    this.options.port = port;
  }

  public async getEmails(): Promise<YasumuEmailMessage[]> {
    try {
      return await invoke(Commands.GetEmails);
    } catch (e) {
      throw e;
    }
  }

  public async start() {
    await invoke(Commands.StartSmtpServer, {
      port: this.options.port,
    });
    this._running = true;
  }

  public async stop() {
    await invoke(Commands.StopSmtpServer);
    this._running = false;
  }
}

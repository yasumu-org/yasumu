import {
  Commands,
  type StartSmtpServerCommand,
} from '@/core/common/commands.js';
import type { YasumuWorkspace } from '../../YasumuWorkspace.js';
import type { Callback } from '@/externals/index.js';
import { YasumuEvents } from '@/core/common/events.js';
import type { YasumuMail } from './types.js';

export const YasumuEmailType = {
  All: 'all',
  Unread: 'unread',
  Read: 'read',
} as const;

export type YasumuEmailType =
  (typeof YasumuEmailType)[keyof typeof YasumuEmailType];

export class YasumuSmtp {
  /**
   * Creates Yasumu smtp server controller
   * @param workspace The parent Yasumu workspace instance
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}

  /**
   * Register a handler for new emails
   * @param handler The handler to register
   * @returns The unsubscribe function
   */
  public async onUpdate(handler: Callback<[YasumuMail]>) {
    return this.workspace.yasumu.events.listen(YasumuEvents.NewEmail, handler);
  }

  /**
   * Register a handler for all emails refresh
   * @param handler The handler to register
   * @returns The unsubscribe function
   */
  public async onRefreshAll(handler: Callback) {
    return this.workspace.yasumu.events.listen(
      YasumuEvents.RefreshAll,
      handler
    );
  }

  /**
   * Fetch all emails from the smtp server
   */
  public async fetch(type?: YasumuEmailType) {
    return this.workspace.send(Commands.GetEmails, {
      read:
        !type || type === YasumuEmailType.All
          ? undefined
          : type === YasumuEmailType.Read,
    });
  }

  /**
   * Deletes an email by id
   */
  public async delete(id: string) {
    return this.workspace.send(Commands.DeleteEmail, { id });
  }

  /**
   * Get all emails count
   */
  public async getEmailsCount(type: YasumuEmailType) {
    switch (type) {
      case YasumuEmailType.All:
        return this.workspace.send(Commands.GetAllEmailsCount, {});
      case YasumuEmailType.Read:
        return this.workspace.send(Commands.GetReadEmailsCount, {});
      case YasumuEmailType.Unread:
        return this.workspace.send(Commands.GetUnreadEmailsCount, {});
      default:
        throw new Error(`Invalid email type: ${type}`);
    }
  }

  /**
   * Get email by id
   * @param id The email id
   */
  public async getEmail(id: string) {
    return this.workspace.send(Commands.GetEmail, { id });
  }

  /**
   * Mark an email as unread
   * @param id The email id
   */
  public async markAsUnread(id: string) {
    return this.workspace.send(Commands.MarkAsUnread, { id });
  }

  /**
   * Mark all emails as read
   */
  public async markAllAsRead() {
    return this.workspace.send(Commands.MarkAllAsRead, {});
  }

  /**
   * Mark all emails as unread
   */
  public async markAllAsUnread() {
    return this.workspace.send(Commands.MarkAllAsUnread, {});
  }

  /**
   * Clear all emails from the smtp server
   */
  public async clear() {
    return this.workspace.send(Commands.ClearEmails, {});
  }

  /**
   * Start the smtp server
   * @param options The options for the smtp server
   */
  public async start(options: StartSmtpServerCommand) {
    await this.workspace.send(Commands.StartSmtpServer, options);
  }

  /**
   * Stop the smtp server
   */
  public async stop() {
    await this.workspace.send(Commands.StopSmtpServer, {});
  }

  /**
   * Whether the smtp server is running
   * @returns True if the smtp server is running
   */
  public async isRunning() {
    return this.workspace.send(Commands.IsSmtpServerRunning, {});
  }
}

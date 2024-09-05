import type { InvokeArgs } from '@/externals/index.js';
import type { YasumuMail } from '../api/workspace/modules/smtp/types.js';

export const Commands = {
  // Workspace
  GetCurrentWorkspace: 'get_current_workspace',
  SetCurrentWorkspace: 'set_current_workspace',
  ClearCurrentWorkspaceSession: 'clear_current_workspace_session',
  // Network
  GetLocalAddress: 'get_local_address',
  // Smtp
  StartSmtpServer: 'start_smtp_server',
  StopSmtpServer: 'stop_smtp_server',
  GetEmails: 'get_emails',
  ClearEmails: 'clear_emails',
  IsSmtpServerRunning: 'is_smtp_server_running',
  GetEmail: 'get_email',
  MarkAsUnread: 'mark_as_unread',
  MarkAllAsRead: 'mark_all_as_read',
  MarkAllAsUnread: 'mark_all_as_unread',
  GetUnreadEmailsCount: 'get_unread_emails_count',
  GetReadEmailsCount: 'get_read_emails_count',
  GetAllEmailsCount: 'get_all_emails_count',
  DeleteEmail: 'delete_email',
  // Scripting
  EvaluateJavaScript: 'evaluate_javascript',
} as const;

export type Commands = (typeof Commands)[keyof typeof Commands];

export type CommandInvocation<T extends InvokeArgs = {}, R = void> = [T, R];
export type InferCommandArguments<T extends CommandInvocation> = T[0];
export type InferCommandResult<T extends CommandInvocation> = T[1];

export interface SetCurrentWorkspaceCommand {
  path: string;
}

export interface StartSmtpServerCommand {
  port: number;
}

export interface CommandsInvocationMap {
  // Workspace
  [Commands.GetCurrentWorkspace]: CommandInvocation<{}, string | null>;
  [Commands.SetCurrentWorkspace]: CommandInvocation<
    SetCurrentWorkspaceCommand,
    void
  >;
  [Commands.ClearCurrentWorkspaceSession]: CommandInvocation<{}, void>;
  // Network
  [Commands.GetLocalAddress]: CommandInvocation<{}, string>;
  // Smtp
  [Commands.StartSmtpServer]: CommandInvocation<StartSmtpServerCommand, void>;
  [Commands.StopSmtpServer]: CommandInvocation<{}, void>;
  [Commands.GetEmails]: CommandInvocation<
    {
      read?: boolean;
    },
    YasumuMail[]
  >;
  [Commands.ClearEmails]: CommandInvocation<{}, void>;
  [Commands.IsSmtpServerRunning]: CommandInvocation<{}, boolean>;
  [Commands.GetEmail]: CommandInvocation<{ id: string }, YasumuMail | null>;
  [Commands.MarkAsUnread]: CommandInvocation<{ id: string }, void>;
  [Commands.MarkAllAsRead]: CommandInvocation<{}, void>;
  [Commands.MarkAllAsUnread]: CommandInvocation<{}, void>;
  [Commands.GetUnreadEmailsCount]: CommandInvocation<{}, number>;
  [Commands.GetReadEmailsCount]: CommandInvocation<{}, number>;
  [Commands.GetAllEmailsCount]: CommandInvocation<{}, number>;
  [Commands.DeleteEmail]: CommandInvocation<{ id: string }, void>;
  // Scripting
  [Commands.EvaluateJavaScript]: CommandInvocation<{ code: string }, any>;
}

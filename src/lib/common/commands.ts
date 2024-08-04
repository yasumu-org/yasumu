export const Commands = {
  // Workspace
  GetCurrentWorkspace: 'get_current_workspace',
  SetCurrentWorkspace: 'set_current_workspace',
  // Http
  GetLocalAddress: 'get_local_address',
  // Smtp
  StartSmtpServer: 'start_smtp_server',
  StopSmtpServer: 'stop_smtp_server',
  GetEmails: 'get_emails',
} as const;

export type Commands = (typeof Commands)[keyof typeof Commands];

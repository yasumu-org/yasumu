export type ShellOpenWith =
  | 'firefox'
  | 'google chrome'
  | 'chromium'
  | 'safari'
  | 'open'
  | 'start'
  | 'xdg-open'
  | 'gio'
  | 'gnome-open'
  | 'kde-open'
  | 'webview';

export interface ShellCommon {
  open(path: string, openWith?: ShellOpenWith): Promise<void>;
}

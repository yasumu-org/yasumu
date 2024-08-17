import { YasumuMail, YasumuSmtp } from '@yasumu/core';
import { create } from 'zustand';

export interface IEmailStore {
  emails: YasumuMail[];
  setEmails: (emails: YasumuMail[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  selectedEmail: YasumuMail | null;
  setSelectedEmail: (email: YasumuMail | null) => void;
}

export const useEmailStore = create<IEmailStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  emails: [],
  setEmails: (emails) => set({ emails }),
  selectedEmail: null,
  setSelectedEmail: (email) => set({ selectedEmail: email }),
}));

export interface IYasumuSmtpStore {
  port: number;
  running: boolean;
  setPort: (port: number) => void;
  setRunning: (running: boolean) => void;
}

export const useYasumuSmtp = create<IYasumuSmtpStore>((set) => ({
  port: 5566,
  running: false,
  setPort: (port) => set({ port }),
  setRunning: (running) => set({ running }),
}));

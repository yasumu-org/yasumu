import { YasumuEmailType, YasumuMail } from '@yasumu/core';
import { create } from 'zustand';

export interface IEmailStore {
  emailType: YasumuEmailType;
  setEmailType: (type: YasumuEmailType) => void;
  emails: YasumuMail[];
  setEmails: (emails: YasumuMail[]) => void;
  updateEmail: (emails: YasumuMail) => void;
  addEmail: (email: YasumuMail) => void;
  removeEmail: (email: string) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  selectedEmail: string | null;
  setSelectedEmail: (email: string | null) => void;
}

export const useEmailStore = create<IEmailStore>((set) => ({
  emailType: YasumuEmailType.All,
  setEmailType: (type) => set({ emailType: type }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  emails: [],
  setEmails: (emails) => set({ emails }),
  addEmail: (email) =>
    set((prev) => {
      if (prev.emails.find((e) => e.id === email.id)) return prev;
      return { emails: [email, ...prev.emails] };
    }),
  updateEmail: (email) =>
    set((prev) => {
      if (prev.emails.find((e) => e.id === email.id)) {
        return { emails: prev.emails.map((e) => (e.id === email.id ? email : e)) };
      }
      return { emails: [email, ...prev.emails] };
    }),
  removeEmail: (email) => set((prev) => ({ emails: prev.emails.filter((e) => e.id !== email) })),
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

import { YasumuSmtp } from '@yasumu/core';
import { create } from 'zustand';

type YasumuEmailMessage = {};

export interface IEmailStore {
  emails: YasumuEmailMessage[];
  setEmails: (emails: YasumuEmailMessage[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  selectedEmail: YasumuEmailMessage | null;
  setSelectedEmail: (email: YasumuEmailMessage | null) => void;
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
  yasumu: YasumuSmtp | null;
  setYasumu: (yasumu: YasumuSmtp | null) => void;
}

export const useYasumuSmtp = create<IYasumuSmtpStore>((set) => ({
  yasumu: null,
  setYasumu: (yasumu) => set({ yasumu }),
}));

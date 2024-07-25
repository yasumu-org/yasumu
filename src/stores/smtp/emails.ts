import { YasumuEmailMessage, YasumuSmtp } from '@/lib/smtp/YasumuSmtp';
import { create } from 'zustand';

export interface IEmailStore {
  emails: YasumuEmailMessage[];
  setEmails: (emails: YasumuEmailMessage[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useEmailStore = create<IEmailStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  emails: [],
  setEmails: (emails) => set({ emails }),
}));

export interface IYasumuSmtpStore {
  yasumu: YasumuSmtp | null;
  setYasumu: (yasumu: YasumuSmtp | null) => void;
}

export const useYasumuSmtp = create<IYasumuSmtpStore>((set) => ({
  yasumu: null,
  setYasumu: (yasumu) => set({ yasumu }),
}));

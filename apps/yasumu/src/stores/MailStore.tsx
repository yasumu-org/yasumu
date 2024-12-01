import { IMail } from '@/components/sidebars/MailSidebar';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';

export const $currentMail = atom<IMail | null>(null);

export function useCurrentMail() {
  return useStore($currentMail);
}

export function setCurrentMail(mail: IMail | null) {
  $currentMail.set(mail);
}

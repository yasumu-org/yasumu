'use client';

import { useNewEmail } from '@/hooks/use-new-email';
import { useRefreshEmails } from '@/hooks/use-refresh-emails';
import { Yasumu } from '@/lib/yasumu';
import { useEmailStore } from '@/stores/smtp/emails';
import { YasumuEmailType } from '@yasumu/core';
import { useCallback, useEffect } from 'react';
import { Badge } from '../ui/badge';

export function WithSmtpMetadata({ children }: React.PropsWithChildren) {
  const { addEmail, setUnreadCount, unreadCount } = useEmailStore();

  const fetchUnreadCount = useCallback(() => {
    Yasumu.workspace?.smtp.getEmailsCount(YasumuEmailType.Unread).then((count) => {
      setUnreadCount(count);
    }, Object);
  }, []);

  useNewEmail(async (email) => {
    addEmail(email);
    fetchUnreadCount();
  });

  useRefreshEmails(fetchUnreadCount);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  if (unreadCount < 1) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-destructive" />
    </div>
  );
}

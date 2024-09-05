'use client';

import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { YasumuEmailType, YasumuMail } from '@yasumu/core';
import { useEmailStore, useYasumuSmtp } from '@/stores/smtp/emails';
import { useEffect, useState } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { CodeBlock } from '@/components/code/code-block';

export function MailDisplay() {
  const { port } = useYasumuSmtp();
  const { selectedEmail, updateEmail, setUnreadCount } = useEmailStore();
  const [mail, setMail] = useState<YasumuMail | null>(null);

  useEffect(() => {
    const smtp = Yasumu.workspace?.smtp;

    if (!smtp) return;

    if (!selectedEmail) {
      setMail(null);
      return;
    }

    smtp.getEmail(selectedEmail).then((email) => {
      setMail(email);
      if (email) updateEmail(email);

      return smtp.getEmailsCount(YasumuEmailType.Unread).then((count) => {
        setUnreadCount(count);
      });
    }, Object);
  }, [selectedEmail]);

  if (!mail)
    return (
      <div className="p-4 space-y-2">
        <p>
          Yasumu smtp server is running on port <span className="font-mono bg-slate-700 text-white px-1">{port}</span>.
          You can follow the example below to send an email.
        </p>
        <CodeBlock language="javascript">
          {`import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  port: ${port},
  host: 'localhost',
});

await transporter.sendMail({
  from: 'sender@example.com',
  to: 'receiver@example.com',
  subject: 'This is a test email',
  text: 'Hello, this is a test email from Yasumu SMTP server.',
})`}
        </CodeBlock>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2"></div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <div className="grid gap-1">
              <div className="line-clamp-1 text-base font-medium">{mail.subject}</div>
              <div className="line-clamp-1 text-sm">
                <span className="font-medium">ID:</span> {mail.id}
              </div>
              <div className="line-clamp-1 text-sm">
                <span className="font-medium">From:</span> {mail.from}
              </div>
              <div className="line-clamp-1 text-sm">
                <span className="font-medium">To:</span> {mail.to}
              </div>
            </div>
          </div>
          {mail.date && (
            <div className="ml-auto text-xs text-muted-foreground">{format(new Date(mail.date), 'PPpp')}</div>
          )}
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-base">{mail.body}</div>
        <Separator className="mt-auto" />
      </div>
    </div>
  );
}

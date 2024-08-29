'use client';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useEmailStore, useYasumuSmtp } from '@/stores/smtp/emails';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreateSmtp } from './create';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Yasumu } from '@/lib/yasumu';
import { Content } from '@/components/layout/content';
import { Mail } from './mail/mail';

export function BootstrapSMTP() {
  const { setEmails } = useEmailStore();
  const { port, setPort, running, setRunning } = useYasumuSmtp();

  useEffect(() => {
    if (!Yasumu.workspace?.smtp) return;

    const dispose = Yasumu.workspace.smtp.onUpdate(handleEmailReceived);

    return () => {
      dispose.then((d) => d());
    };
  }, []);

  const handleEmailReceived = async () => {
    if (!Yasumu.workspace?.smtp) return;

    try {
      const emails = await Yasumu.workspace.smtp.fetch();
      setEmails(emails);
    } catch {}
  };

  const startSmtp = useCallback(async () => {
    const isRunning = await Yasumu.workspace?.smtp.isRunning();
    if (isRunning) return toast.info('SMTP server is already running.');

    try {
      const smtp = Yasumu.workspace!.smtp;
      const smtpPort = Number(port) || 5566;

      smtp.start({ port: smtpPort });
      setRunning(true);
      toast.success(`SMTP server started on port ${smtpPort}`);
    } catch (e) {
      toast.error(`Failed to start SMTP server: ${String(e)}`);
    }
  }, [port]);

  useEffect(() => {
    if (!Yasumu.workspace?.smtp) return;

    Yasumu.workspace.smtp.isRunning().then((running) => {
      console.log({ running });
      setRunning(running);
    }, console.error);
  }, []);

  if (running) return <Mail defaultLayout={[32, 48]} />;

  return (
    <div>
      <h1 className="text-xl font-medium">SMTP Server</h1>
      <p>
        Local SMTP server for development and testing. This runs a catch-all email server that does not deliver the
        email to the actual destination.
        <br />
        This server only supports inbound requests. The emails sent to this server are stored in memory and will be
        erased once the application is closed.
      </p>
      <div className="py-8">
        <div className="flex items-center gap-2">
          <CreateSmtp port={port} setPort={setPort} />
          <Button size="sm" disabled={Number.isNaN(port)} onClick={startSmtp}>
            <Rocket className="h-5 w-5 mr-2" />
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}

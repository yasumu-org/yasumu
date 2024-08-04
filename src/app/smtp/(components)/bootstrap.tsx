'use client';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useEmailStore, useYasumuSmtp } from '@/stores/smtp/emails';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { YasumuSmtp } from '@/lib/smtp/YasumuSmtp';
import { listen } from '@tauri-apps/api/event';
import { CreateSmtp } from './create';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export function BootstrapSMTP() {
  const { setEmails } = useEmailStore();
  const { setYasumu, yasumu } = useYasumuSmtp();
  const [port, setPort] = useState('5566');

  useEffect(() => {
    if (!yasumu) return;

    const dispose = listen(yasumu.EmailChannel, handleEmailReceived);

    return () => {
      dispose.then((d) => d());
    };
  }, [yasumu]);

  const handleEmailReceived = async () => {
    if (!yasumu) return;

    try {
      const emails = await yasumu.getEmails();
      setEmails(emails);
    } catch {}
  };

  const startSmtp = useCallback(async () => {
    if (yasumu) return toast.info('SMTP server is already running.');

    try {
      const yasumu = new YasumuSmtp({ port: Number(port) || 5566 });
      // @ts-ignore
      globalThis.yasumu = yasumu;
      await yasumu.start();
      setYasumu(yasumu);
      toast.success(`SMTP server started on port ${yasumu.getPort()}`);
    } catch (e) {
      toast.error(`Failed to start SMTP server: ${String(e)}`);
    }
  }, [port, yasumu]);

  const stopSmtp = useCallback(async () => {
    if (!yasumu) return;

    try {
      await yasumu.stop();
      setYasumu(null);
    } catch (e) {
      toast.error(`Failed to stop SMTP server: ${String(e)}`);
    }
  }, [yasumu]);

  return (
    <div className="py-8">
      {yasumu?.running ? (
        <div>
          <Card>
            <CardHeader>
              SMTP Server is running on port {yasumu.getPort()}
            </CardHeader>
            <CardFooter>
              <Link href="/smtp/mail">
                <Button>View Emails</Button>
              </Link>
              <Button onClick={stopSmtp}>Stop</Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CreateSmtp port={port} setPort={setPort} />
          <Button size="sm" disabled={Number.isNaN(port)} onClick={startSmtp}>
            <Rocket className="h-5 w-5 mr-2" />
            Start
          </Button>
        </div>
      )}
    </div>
  );
}

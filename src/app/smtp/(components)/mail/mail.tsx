'use client';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MailDisplay } from './mail-display';
import { RefreshCcw, RocketIcon, Search, StopCircle, Trash2 } from 'lucide-react';
import { MailList } from './mail-list';
import { useEmailStore, useYasumuSmtp } from '@/stores/smtp/emails';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { YasumuEmailType } from '@yasumu/core';
import useDebounce from '@/hooks/use-debounce';
import { useRefreshEmails } from '@/hooks/use-refresh-emails';
import { toast } from 'sonner';
import { Tooltip } from '@/components/alerts/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MailProps {
  defaultLayout: number[] | undefined;
}

export function Mail({ defaultLayout = [32, 48] }: MailProps) {
  const { setRunning, port } = useYasumuSmtp();
  const { emails, setEmails, emailType, setEmailType, addEmail } = useEmailStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const search = useDebounce(searchQuery, 500);

  const stopSmtp = useCallback(async () => {
    if (!Yasumu.workspace?.smtp) return;

    try {
      await Yasumu.workspace.smtp.stop();
      setRunning(false);
    } catch (e) {
      toast.error(`Failed to stop SMTP server: ${String(e)}`);
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    const smtp = Yasumu.workspace?.smtp;
    if (!smtp) return;

    try {
      await smtp.clear();
      setEmails([]);
    } catch {}
  }, []);

  const handleRefresh = useCallback(async () => {
    const smtp = Yasumu.workspace?.smtp;
    if (!smtp) return;

    try {
      const emails = await smtp.fetch(emailType === YasumuEmailType.All ? undefined : emailType);
      setEmails(emails);
    } catch {}
  }, [emailType]);

  useRefreshEmails(handleRefresh);

  useEffect(() => {
    handleRefresh();
  }, [emailType]);

  const searchFiltered = useMemo(() => {
    if (!search) return emails;

    return emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(search.toLowerCase()) ||
        email.from.toLowerCase().includes(search.toLowerCase()) ||
        email.to.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, emails]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue={emailType} onValueChange={(value) => setEmailType(value as YasumuEmailType)}>
            <div className="flex items-center px-4 py-2 gap-4">
              <h1 className="text-xl font-bold">Yasumu SMTP</h1>

              <TabsList className="ml-auto">
                <TabsTrigger value={YasumuEmailType.All} className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value={YasumuEmailType.Unread} className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
              <Tooltip title="Refresh emails">
                <Button size="icon" onClick={handleRefresh}>
                  <RefreshCcw className="h-5 w-5" />
                </Button>
              </Tooltip>
              <Tooltip title="Clear all emails">
                <Button size="icon" variant={'destructive'} onClick={handleClearAll}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Tooltip>
              <Tooltip title="Stop email server">
                <Button onClick={stopSmtp} variant="destructive" size="icon">
                  <StopCircle className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </form>
            </div>
            <MailList items={searchFiltered} />
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

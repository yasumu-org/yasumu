'use client';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MailDisplay } from './mail-display';
import { RefreshCcw, Search, Trash2 } from 'lucide-react';
import { MailList } from './mail-list';
import { useEmailStore } from '@/stores/smtp/emails';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect } from 'react';
import { Yasumu } from '@/lib/yasumu';

interface MailProps {
  defaultLayout: number[] | undefined;
}

export function Mail({ defaultLayout = [32, 48] }: MailProps) {
  const { selectedEmail, emails, setEmails } = useEmailStore();

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
      const emails = await smtp.fetch();
      setEmails(emails);
    } catch {}
  }, []);

  useEffect(() => {
    handleRefresh();
  }, []);

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
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2 gap-4">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
              <Button size="icon" onClick={handleRefresh}>
                <RefreshCcw className="h-5 w-5" />
              </Button>
              <Button size="icon" variant={'destructive'} onClick={handleClearAll}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={emails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {/* <MailList items={emails.filter((item) => !item.read)} /> */}
              <MailList items={emails} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay mail={emails.find((item) => item.id === (selectedEmail?.id || null)) || null} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

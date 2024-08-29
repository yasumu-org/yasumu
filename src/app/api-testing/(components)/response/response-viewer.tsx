'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import PrettyResponseViewer from './pretty-response-viewer';
import { ResponseHeaders } from './response-headers';
import { cn } from '@/lib/utils';
import { ResponseCookies } from './response-cookies';
import { ResponseStats } from './stats/response-stats';
import { useLayoutStore } from '@/stores/application/layout.store';
import { useResponse } from '@/stores/api-testing/response.store';
import { LoadingSpinner } from '@/components/layout/loading';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { useEffect, useMemo } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { ResponseAttachmentGuard } from './response-attachment-guard';
import { YasumuConsole } from '@/components/console/yasumu-console';
import { useConsole } from '@/stores/api-testing/console.store';
import { CopyToClipboard } from '@/components/code/copy-to-clipboard';

export default function ResponseViewer() {
  const { orientation } = useLayoutStore();
  const logsCount = useConsole((state) => {
    return state.logs.length;
  });
  const { headers, cookies, body, abortController, responseSize, responseStatus, responseTime } = useResponse();

  const { current } = useRequestStore();

  const save = useDebounceCallback(() => {
    if (!current) return;

    current.setResponse({
      body,
      headers: headers.map((header) => ({
        key: header.key,
        value: header.value,
      })),
      size: responseSize,
      status: responseStatus,
      time: responseTime,
    });

    current.save().catch(Object);
  }, 500);

  useEffect(() => {
    if (current) {
      save();
    }
  }, [body, headers, responseSize, responseStatus, responseTime]);

  const contentType = useMemo(() => {
    try {
      const header = headers.find((header) => header.key.toLowerCase() === 'content-type');
      return header?.value || null;
    } catch {
      return null;
    }
  }, [headers]);

  return (
    <div className={cn(orientation === 'horizontal' ? 'px-2' : 'p-2')}>
      <Tabs defaultValue="pretty" className="rounded-b-none">
        <div
          className={cn('flex items-center justify-between', {
            'opacity-20': abortController != null,
          })}
        >
          <TabsList className="rounded-b-none border-x border-t">
            <TabsTrigger value="pretty">Pretty</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">
              Headers <span className="text-green-500 text-sm ml-2">({headers.length})</span>
            </TabsTrigger>
            <TabsTrigger value="cookies">
              Cookies <span className="text-green-500 text-sm ml-2">({cookies.length})</span>
            </TabsTrigger>
            <TabsTrigger value="console">
              Console{logsCount > 0 && <span className="text-green-500 text-sm ml-2">({logsCount})</span>}
            </TabsTrigger>
          </TabsList>
          <ResponseStats />
        </div>
        {abortController != null ? (
          <LoadingSpinner className="h-auto" />
        ) : (
          <div
            className={cn(
              'border rounded-b-sm p-2 overflow-y-auto',
              orientation === 'vertical' ? 'max-h-[400px]' : 'max-h-[90vh]',
            )}
          >
            <TabsContent value="pretty">
              <ResponseAttachmentGuard contentType={contentType}>
                <PrettyResponseViewer content={body} />
              </ResponseAttachmentGuard>
            </TabsContent>
            <TabsContent value="raw">
              <ResponseAttachmentGuard contentType={contentType}>
                <CopyToClipboard value={body}>
                  <pre className={cn('word-break-break-all whitespace-pre-wrap text-sm')}>{body}</pre>
                </CopyToClipboard>
              </ResponseAttachmentGuard>
            </TabsContent>
            <TabsContent value="headers">
              <ResponseHeaders headers={headers} />
            </TabsContent>

            <TabsContent value="cookies">
              <ResponseCookies cookies={cookies} />
            </TabsContent>
            <TabsContent value="console">
              <YasumuConsole />
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}

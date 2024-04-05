import { useListener } from '@/hooks/useListener';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ReadonlyHeaders } from './headers';
import { ScrollArea } from '../ui/scroll-area';
import { Output } from './output';

interface ExecutionError {
  body: string;
}

interface ExecutionResult {
  status: number;
  statusText: string;
  time: number;
  body: string;
  headers: Map<string, string>;
}

export function RequestResult() {
  const [response, setResponse] = useState<ExecutionResult | null>(null);

  useListener<ExecutionResult>('execution-result', (data) => {
    const { body, headers, status, statusText, time } = data.payload;
    setResponse({
      body,
      headers: new Map(Object.entries(headers)),
      status,
      statusText,
      time,
    });
  });

  useListener<ExecutionError>('execution-error', (data) => {
    toast('Request failed!', {
      description: data.payload.body,
      dismissible: true,
    });
  });

  return (
    <div className="p-2">
      {response ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Response</h4>
            <div className="flex items-center gap-2">
              <Status code={response.status} text={response.statusText} />
              <Time time={response.time} />
            </div>
          </div>
          <Tabs defaultValue="body">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">
                Headers{' '}
                {response.headers.size > 0 && (
                  <span className="text-emerald-500 text-xs ml-1">
                    ({response.headers.size})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="body">
              <ScrollArea className="h-[38vh]">
                <div className="pt-4">
                  <Output
                    value={response.body}
                    contentType={
                      response.headers.get('Content-Type') ||
                      response.headers.get('content-type')
                    }
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="headers">
              <ScrollArea className="h-[38vh]">
                <ReadonlyHeaders headers={response.headers} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <h4 className="text-muted-foreground text-sm">
          Make a request to see the response.
        </h4>
      )}
    </div>
  );
}

function Time({ time }: { time: number }) {
  const unit = time < 1000 ? 'ms' : 's';
  const formattedTime = time < 1000 ? time : (time / 1000).toFixed(2);

  return (
    <h4 className="text-xs text-muted-foreground">
      Time:{' '}
      <span
        className={cn(
          'font-semibold',
          time < 1000 && 'text-emerald-500',
          time >= 1000 && time < 10000 && 'text-orange-500',
          time >= 10000 && 'text-red-500'
        )}
      >
        {formattedTime}
        {unit}
      </span>
    </h4>
  );
}

function Status({ code, text }: { code: number; text: string }) {
  return (
    <h4 className="text-xs text-muted-foreground">
      Status:{' '}
      <span
        className={cn(
          'font-semibold',
          code < 200 && 'text-blue-500',
          code >= 200 && code < 300 && 'text-emerald-500',
          code >= 300 && code < 400 && 'text-orange-500',
          code >= 400 && 'text-red-500'
        )}
      >
        {code} {text}
      </span>
    </h4>
  );
}

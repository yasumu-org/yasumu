import { useListener } from '@/hooks/useListener';
import { useState } from 'react';
import { Editor } from '@monaco-editor/react';

interface ExecutionError {
  body: string;
}

interface ExecutionResult {
  status: number;
  time: number;
  body: string;
  headers: Map<string, string>;
}

export function RequestResult() {
  const [response, setResponse] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<ExecutionError | null>(null);

  useListener<ExecutionResult>('execution-result', (data) => {
    console.log(data);
    setResponse(data.payload);
  });

  useListener<ExecutionError>('execution-error', (data) => {
    console.log(data);
    setError(data.payload);
  });

  return (
    <div className="p-2">
      {!response && (
        <div className="text-muted-foreground">Make a request first</div>
      )}
      {error && (
        <div>
          <div className="text-sm font-semibold">Error</div>
          <div className="text-sm">{error.body}</div>
        </div>
      )}
      {response && (
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-emerald-500">
              {response.status}
            </div>
            <div className="text-sm text-amber-600">{response.time}ms</div>
          </div>
          <div className="text-sm h-full">
            <Editor
              height="300px"
              defaultValue={response.body}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

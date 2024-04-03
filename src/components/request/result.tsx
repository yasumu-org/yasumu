import { useListener } from '@/hooks/useListener';
import { useState } from 'react';

interface RequestResultResponse {
  response: string;
  status: number;
}

export function RequestResult() {
  const [response, setResponse] = useState<RequestResultResponse | null>(null);

  useListener<RequestResultResponse>('execution-result', (data) => {
    console.log(data);
    setResponse(data.payload);
  });

  return (
    <div className="p-2">
      {!response && (
        <div className="text-muted-foreground">Make a request first</div>
      )}
      {response && (
        <div>
          <div className="text-sm font-semibold">{response.status}</div>
          <div className="text-sm">{response.response}</div>
        </div>
      )}
    </div>
  );
}

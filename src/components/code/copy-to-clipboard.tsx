'use client';

import { Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { Tooltip } from '../alerts/tooltip';

export function CopyToClipboard({ children, value }: React.PropsWithChildren<{ value: string }>) {
  const copy = useClipboard();

  return (
    <div className="relative">
      {children}
      {value && (
        <Tooltip title="Copy" side="bottom">
          <Button className="absolute top-1 right-1" size="icon" variant="ghost" onClick={() => copy(value)}>
            <Copy className="h-4 w-4" />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}

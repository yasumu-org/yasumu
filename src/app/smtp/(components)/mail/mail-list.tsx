'use client';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmailStore } from '@/stores/smtp/emails';
import { YasumuMail } from '@yasumu/core';
import { Mail } from 'lucide-react';

interface MailListProps {
  items: (YasumuMail & {
    read?: boolean;
  })[];
}

export function MailList({ items }: MailListProps) {
  const { selectedEmail, setSelectedEmail } = useEmailStore();

  return (
    <ScrollArea className="h-screen">
      <div
        className={cn('flex flex-col gap-2 p-4 pt-0 relative', {
          'flex items-center justify-center min-h-96': !items.length,
        })}
      >
        {!items.length && (
          <div className="text-muted-foreground absolute -z-10 flex items-center justify-center flex-col">
            <Mail className="h-52 w-52 mx-auto" />
            <p className="text-lg">No emails found.</p>
          </div>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              selectedEmail === item.id && 'bg-muted',
            )}
            onClick={() => setSelectedEmail(selectedEmail === item.id ? null : item.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.from}</div>
                  {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                {item.date && (
                  <div
                    className={cn(
                      'ml-auto text-xs',
                      selectedEmail === item.id ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {formatDistanceToNow(new Date(item.date as string), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">Email id: {item.id}</div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

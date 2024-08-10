"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { YasumuEmailMessage } from "@/lib/smtp/YasumuSmtp";

interface MailDisplayProps {
  mail: YasumuEmailMessage | null;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2"></div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.from}
                </div>
              </div>
            </div>
            {mail.created_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.created_at as string), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {mail.body}
          </div>
          <Separator className="mt-auto" />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}

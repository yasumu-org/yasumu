'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HttpMethodColors,
  HttpMethods,
  HttpMethodsArray,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';

export default function RequestInput() {
  const { method, setMethod, url, setUrl } = useRequestConfig();

  return (
    <div className="flex gap-2">
      <div className="flex w-full">
        <Select
          value={method}
          onValueChange={(value) => {
            const newMethod = HttpMethods[value as HttpMethods];
            if (newMethod) setMethod(newMethod);
          }}
        >
          <SelectTrigger
            className={cn(
              'w-[150px] rounded-r-none border-r-0 select-none',
              HttpMethodColors[method]
            )}
          >
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HttpMethodsArray.map((m) => (
              <SelectItem key={m} value={m}>
                <span className={cn('font-semibold', HttpMethodColors[m])}>
                  {m}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="rounded-l-none"
          placeholder="Enter a url..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button>Send</Button>
    </div>
  );
}

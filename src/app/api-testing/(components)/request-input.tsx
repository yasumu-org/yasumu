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
import { IHttpMethod, HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function RequestInput() {
  const [method, setMethod] = useState<IHttpMethod>(HttpMethods[0]);

  return (
    <div className="flex gap-2">
      <div className="flex w-full">
        <Select
          value={method.name}
          onValueChange={(value) => {
            const newMethod = HttpMethods.find((m) => m.name === value);
            if (newMethod) setMethod(newMethod);
          }}
        >
          <SelectTrigger
            className={cn(
              'w-[150px] rounded-r-none border-r-0 select-none',
              method.color
            )}
          >
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HttpMethods.map((m) => (
              <SelectItem key={m.name} value={m.name}>
                <span className={cn('font-semibold', m.color)}>{m.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input className="rounded-l-none" placeholder="Enter a url..." />
      </div>
      <Button>Send</Button>
    </div>
  );
}

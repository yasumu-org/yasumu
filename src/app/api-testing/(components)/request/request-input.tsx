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
import { ICookie, useResponse } from '@/stores/api-testing/response.store';
import { fetch } from '@tauri-apps/plugin-http';
import { useCallback } from 'react';
import { parseString } from 'set-cookie-parser';

export default function RequestInput() {
  const { method, setMethod, url, setUrl, body, headers } = useRequestConfig();
  const responseStore = useResponse((u) => {
    const {
      setBody,
      setHeaders,
      setResponseTime,
      setResponseStatus,
      setResponseSize,
      setCookies,
    } = u;

    return {
      setBody,
      setHeaders,
      setResponseTime,
      setResponseStatus,
      setResponseSize,
      setCookies,
    };
  });

  const dispatchRequest = useCallback(async () => {
    try {
      const h = new Headers();

      headers.forEach((header) => {
        if (header.enabled && header.key && header.value)
          h.append(header.key, header.value);
      });

      const start = Date.now();

      const res = await fetch(url, {
        method: method.toUpperCase(),
        body: !['GET', 'HEAD', 'OPTIONS'].includes(method) ? body : undefined,
        redirect: 'follow',
        maxRedirections: 20,
        cache: 'no-cache',
        credentials: 'omit',
        connectTimeout: 60_000,
        headers: h,
      });

      const end = Math.abs(Date.now() - start);

      responseStore.setResponseStatus(res.status);
      responseStore.setResponseTime(end);

      const cookies: ICookie[] = res.headers.getSetCookie().map((c) => {
        const data = parseString(c);

        return {
          name: data.name,
          value: data.value,
          domain: data.domain ?? '',
          path: data.path ?? '',
          expires: data.expires?.toLocaleString() ?? '',
          httpOnly: data.httpOnly ?? false,
          secure: data.secure ?? false,
          sameSite: data.sameSite ?? '',
        };
      });

      responseStore.setCookies(cookies);

      const resHeaders = Array.from(res.headers.entries()).map(
        ([key, value]) => ({
          key,
          value,
        })
      );

      responseStore.setHeaders(resHeaders);

      const value = await res.arrayBuffer();
      const str = new TextDecoder().decode(value);

      responseStore.setBody(str);
      responseStore.setResponseSize(value.byteLength);
    } catch (e) {
      console.error(e);
      responseStore.setBody(String(e));
    }
  }, [url, method, headers, body, responseStore]);

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
      <Button onClick={dispatchRequest}>Send</Button>
    </div>
  );
}

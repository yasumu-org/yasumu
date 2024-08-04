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
import {
  useRequestConfig,
  useRequestStore,
} from '@/stores/api-testing/request-config.store';
import { ICookie, useResponse } from '@/stores/api-testing/response.store';
import { fetch } from '@tauri-apps/plugin-http';
import { useCallback, useEffect } from 'react';
import { parseString } from 'set-cookie-parser';
import { useDebounceCallback } from 'usehooks-ts';

export default function RequestInput() {
  const { current } = useRequestStore();
  const { method, setMethod, url, setUrl, body, headers } = useRequestConfig();

  const save = useDebounceCallback(() => {
    if (!current) return;

    current.setUrl(url);
    current.setMethod(method);
    current.setBody(body);
    current.setHeaders(
      headers.map((header) => ({
        key: header.key,
        value: header.value,
      }))
    );

    current.save().catch(Object);
  }, 500);

  useEffect(() => {
    if (current) {
      save();
    }
  }, [method, url, setUrl, body, headers]);

  const responseStore = useResponse((u) => {
    const {
      setBody,
      setHeaders,
      setResponseTime,
      setResponseStatus,
      setResponseSize,
      setCookies,
      setPending,
    } = u;

    return {
      setBody,
      setHeaders,
      setResponseTime,
      setResponseStatus,
      setResponseSize,
      setCookies,
      setPending,
    };
  });

  const dispatchRequest = useCallback(async () => {
    try {
      responseStore.setPending(true);

      const h = new Headers();

      headers.forEach((header) => {
        if (header.enabled && header.key && header.value)
          h.append(header.key, header.value);
      });

      const start = Date.now();

      const meth = method.toUpperCase();
      const bodyData = meth === 'GET' || meth === 'HEAD' ? undefined : body;
      const res = await fetch(url, {
        method: meth,
        body: bodyData,
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
    } finally {
      responseStore.setPending(false);
    }
  }, [url, method, headers, body, responseStore]);

  return (
    <div className="flex gap-2">
      <div className="flex w-full">
        <Select
          value={method}
          onValueChange={(value) => {
            const newMethod = HttpMethods[value as HttpMethods];
            if (newMethod) {
              setMethod(newMethod);
            }
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

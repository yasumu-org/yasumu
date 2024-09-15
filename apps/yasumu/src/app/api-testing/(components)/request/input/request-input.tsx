'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BodyMode, HttpMethods, HttpMethodsArray, YasumuResponseContextData } from '@yasumu/core';
import { cn, IS_AUDIO, IS_BINARY_DATA, IS_IMAGE, IS_VIDEO } from '@/lib/utils';
import { useRequestConfig, useRequestStore } from '@/stores/api-testing/request-config.store';
import { ICookie, useResponse } from '@/stores/api-testing/response.store';
import { useCallback, useEffect } from 'react';
import { parseString } from 'set-cookie-parser';
import { useDebounceCallback } from 'usehooks-ts';
import { HttpMethodColors } from '@/lib/constants';
import { Yasumu } from '@/lib/yasumu';
import { useConsole } from '@/stores/api-testing/console.store';
import { canEvaluateResult } from '@/lib/scripts/script';
import { useTest } from '@/stores/api-testing/test.store';
import { useScriptTime } from '@/stores/api-testing/script-time.store';

export default function RequestInput() {
  const { current } = useRequestStore();
  const { add } = useConsole();
  const { add: addTest } = useTest();
  const { setPostResponse, setPreRequest, setTestScript } = useScriptTime();
  const { method, setMethod, url, setUrl, body, headers, bodyMode, id, script: preRequestScript } = useRequestConfig();

  const save = useDebounceCallback(() => {
    if (!current) return;

    current.setUrl(url);
    current.setMethod(method);
    // @ts-expect-error
    current.setBody(body);
    current.setHeaders(
      headers.map((header) => ({
        key: header.key,
        value: header.value,
      })),
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
      setAbortController,
      abortController,
      setUrl,
      script,
      test,
    } = u;

    return {
      setBody,
      setHeaders,
      setResponseTime,
      setResponseStatus,
      setResponseSize,
      setCookies,
      setAbortController,
      abortController,
      setUrl,
      postRequestScript: script,
      test,
    };
  });

  const cancelRequest = useCallback(() => {
    if (responseStore.abortController) {
      try {
        responseStore.abortController.abort();
      } catch {
        // noop
      } finally {
        responseStore.setAbortController(null);
      }
    }
  }, [responseStore.abortController]);

  const dispatchRequest = useCallback(async () => {
    try {
      if (!Yasumu.workspace) return;
      const controller = new AbortController();
      responseStore.setAbortController(controller);

      const h = new Headers();

      const kv = Yasumu.workspace.openKV();
      const storeData = await kv.entries();
      const storeRecord = storeData.reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      const contextData: YasumuContextData = {
        response: {} as YasumuResponseContextData,
        request: {
          id,
          url,
          method,
          headers: h as any,
        },
        store: storeRecord,
      };

      headers.forEach((header) => {
        if (header.enabled && header.key && header.value) h.append(header.key, header.value);
      });

      if (!h.has('User-Agent')) {
        try {
          const name = await Yasumu.app.getName();
          const version = await Yasumu.app.getVersion();
          h.append('User-Agent', `${name}/${version}`);
        } catch {
          //
        }
      }

      let bodyData: BodyInit | undefined = undefined;

      switch (bodyMode) {
        case BodyMode.JSON:
          {
            if (!h.has('Content-Type')) {
              h.append('Content-Type', 'application/json');
            }

            bodyData = body.json || undefined;
          }
          break;
        case BodyMode.Text:
          {
            if (!h.has('Content-Type')) {
              h.append('Content-Type', 'text/plain');
            }

            bodyData = body.text || undefined;
          }
          break;
        case BodyMode.UrlencodedFormData:
          {
            if (!h.has('Content-Type')) {
              h.append('Content-Type', 'application/x-www-form-urlencoded');
            }

            bodyData = new URLSearchParams(body.urlencoded.filter((u) => u.enabled).map((p) => [p.key, p.value]));
          }
          break;
        case BodyMode.MultipartFormData:
          {
            if (!h.has('Content-Type')) {
              h.append('Content-Type', 'multipart/form-data');
            }

            bodyData = new FormData();
          }
          break;
        case BodyMode.Binary:
          {
            if (!h.has('Content-Type')) {
              h.append('Content-Type', 'application/octet-stream');
            }

            bodyData = body.binary ? new Blob([body.binary]) : undefined;
          }
          break;
        default:
          {
            bodyData = undefined;
          }
          break;
      }

      if (!!preRequestScript?.trim().length) {
        const preScriptStart = performance.now();
        const result = await Yasumu.scripts.run(preRequestScript, Yasumu.scripts.createContextData(contextData), {
          test: false,
        });
        const preScriptFinish = Math.abs(performance.now() - preScriptStart);

        setPreRequest(preScriptFinish);

        if (canEvaluateResult(result)) {
          if (result.request.canceled) {
            controller.abort();
          }

          if (result.console && result.console.length) {
            add(result.console);
          }

          await Yasumu.workspace.rest.scriptResults.applyContext(result, contextData);

          if (result.request.headers) {
            try {
              const headers = Object.entries(result.request.headers);
              headers.forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  value.forEach((v) => h.append(key, v));
                } else {
                  h.set(key, value);
                }
              });
            } catch {
              //
            }
          }

          if (result.request.url && typeof result.request.url === 'string') {
            setUrl(result.request.url);
          }
        } else if (result && typeof result === 'object' && '$error' in result) {
          add({ args: [result.$error as string], timestamp: Date.now(), type: 'error' });
        }
      }
      const finalUrl = contextData.request.url || url;

      if (!finalUrl) {
        throw new Error('No url provided');
      }

      const start = performance.now();

      const res = await Yasumu.fetch(finalUrl, {
        method: method.toUpperCase(),
        body: bodyData,
        redirect: 'follow',
        // @ts-ignore
        maxRedirections: 10,
        cache: 'no-cache',
        connectTimeout: 60_000,
        headers: h,
        signal: controller.signal,
      });

      if (!res) throw new Error('Failed to fetch response');

      const end = Math.abs(performance.now() - start);

      responseStore.setUrl(res.url);
      responseStore.setResponseStatus(res.status);
      responseStore.setResponseTime(end);

      const cookies: ICookie[] = res.headers.getSetCookie().map((cookie) => {
        const data = parseString(cookie);

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

      const resHeaders = Array.from(res.headers.entries()).map(([key, value]) => ({
        key,
        value,
      }));

      responseStore.setHeaders(resHeaders);

      const contentType = res.headers.get('Content-Type') || '';

      const isTextRenderable =
        !IS_AUDIO(contentType) && !IS_VIDEO(contentType) && !IS_IMAGE(contentType) && !IS_BINARY_DATA(contentType);

      if (isTextRenderable) {
        const value = await res.arrayBuffer();
        const str = new TextDecoder().decode(value);

        const bodySize = Number(res.headers.get('Content-Length')) || value.byteLength;

        contextData.response.bodyText = str;
        contextData.response.contentLength = bodySize;

        responseStore.setBody(str);
        responseStore.setResponseSize(bodySize);
      } else {
        responseStore.setBody('');
        const len = Number(res.headers.get('Content-Length')) || 0;
        contextData.response.contentLength = len;
        responseStore.setResponseSize(len);
      }

      contextData.response.headers = Object.fromEntries(res.headers.entries());
      contextData.response.status = res.status;
      contextData.response.statusText = res.statusText;
      contextData.response.redirected = res.redirected;
      contextData.response.type = res.type;
      contextData.response.url = res.url;
      contextData.response.ok = res.ok;
      contextData.response.cookies = cookies;
      contextData.response.responseTime = end;

      if (!!responseStore.postRequestScript?.trim().length) {
        const postScriptStart = performance.now();
        const result = await Yasumu.scripts.run(
          responseStore.postRequestScript,
          Yasumu.scripts.createContextData(contextData),
          {
            test: false,
          },
        );
        const postScriptFinish = Math.abs(performance.now() - postScriptStart);

        setPostResponse(postScriptFinish);

        if (canEvaluateResult(result)) {
          if (result.console && result.console.length) {
            add(result.console);
          }

          await Yasumu.workspace.rest.scriptResults.applyContext(result, contextData);
        } else if (result && typeof result === 'object' && '$error' in result) {
          add({ args: [result.$error as string], timestamp: Date.now(), type: 'error' });
        }
      }

      if (!!responseStore.test?.trim().length) {
        const testScriptStart = performance.now();
        const result = await Yasumu.scripts.run(responseStore.test, Yasumu.scripts.createContextData(contextData), {
          test: true,
        });
        const testScriptFinish = Math.abs(performance.now() - testScriptStart);

        setTestScript(testScriptFinish);

        if (canEvaluateResult(result)) {
          if (result.console && result.console.length) {
            add(result.console);
          }

          if (result.test.length) {
            addTest(result.test);
          }

          await Yasumu.workspace.rest.scriptResults.applyContext(result, contextData);
        } else if (result && typeof result === 'object' && '$error' in result) {
          add({ args: [result.$error as string], timestamp: Date.now(), type: 'error' });
        }
      }
    } catch (e) {
      console.error(e);
      responseStore.setBody(String(e));
    } finally {
      if (responseStore.abortController) {
        responseStore.abortController.signal.onabort = null;
      }
      responseStore.setAbortController(null);
    }
  }, [url, method, headers, body, responseStore, id, preRequestScript]);

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
          <SelectTrigger className={cn('w-[150px] rounded-r-none border-r-0 select-none', HttpMethodColors[method])}>
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HttpMethodsArray.map((m) => (
              <SelectItem key={m} value={m}>
                <span className={cn('font-semibold', HttpMethodColors[m])}>{m}</span>
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
      {responseStore.abortController ? (
        <Button onClick={cancelRequest} variant="secondary">
          Cancel
        </Button>
      ) : (
        <Button onClick={dispatchRequest}>Send</Button>
      )}
    </div>
  );
}

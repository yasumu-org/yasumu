import { invoke } from '@tauri-apps/api';
import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'sonner';

export type RequestMethod = keyof typeof RequestMethod;

export const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

interface IRequestContext {
  url: string;
  setURL: (url: string) => void;
  method: RequestMethod;
  setMethod: (method: RequestMethod) => void;
  execute: () => void;
  headers: Map<string, string>;
  setHeaders: (key: string, value: string) => void;
  parameters: Map<string, string>;
  setParameters: (key: string, value: string) => void;
  body: string;
  setBody: (body: string) => void;
}

const RequestContext = createContext<IRequestContext | null>(null);

export function RequestContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [url, setURL] = useState('');
  const [method, setMethodInner] = useState<RequestMethod>(RequestMethod.GET);
  const [headers, setHeadersInner] = useState<Map<string, string>>(
    new Map([['User-Agent', 'yasumu/0.0.0']])
  );
  const [parameters, setParametersInner] = useState<Map<string, string>>(
    new Map([['', '']])
  );
  const [body, setBody] = useState('');

  const execute = useCallback(async () => {
    try {
      const _url = new URL(url);
      _url.search = new URLSearchParams(
        Array.from(parameters.entries()).filter(([key]) => key)
      ).toString();

      await invoke('execute', {
        url,
        method,
        headers,
      });
    } catch (e) {
      toast('Error constructing request', {
        description: `${e}`,
      });
    }
  }, [url, method, headers, parameters, body]);

  const setHeaders = useCallback((key: string, value: string) => {
    setHeadersInner((prev) => new Map(prev.set(key, value)));
  }, []);

  const setParameters = useCallback((key: string, value: string) => {
    setParametersInner((prev) => new Map(prev.set(key, value)));
  }, []);

  return (
    <RequestContext.Provider
      value={{
        url,
        setURL,
        method,
        setMethod: (method) =>
          setMethodInner(method.toUpperCase() as RequestMethod),
        execute,
        headers,
        setHeaders,
        parameters,
        setParameters,
        body,
        setBody,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequestContext() {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error(
      'useRequestContext must be used within RequestContextProvider'
    );
  }

  return context;
}

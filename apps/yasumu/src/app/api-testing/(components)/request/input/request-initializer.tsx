'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestInput from './request-input';
import { RequestParameters } from './request-parameters';
import { RequestHeaders } from './request-headers';
import { RequestTabs } from '../env/request-tabs';
import { RequestBody } from '../body/request-body';
import { useRequestConfig, useRequestStore } from '@/stores/api-testing/request-config.store';
import { useEffect } from 'react';
import { useResponse } from '@/stores/api-testing/response.store';
import { PreRequestScript } from '../script/pre-request';
import { PostRequestScript } from '../script/post-request';
import { TestScript } from '../script/test-script';

const ReqTabs = {
  QueryParameters: 'query-parameters',
  Headers: 'headers',
  RequestBody: 'request-body',
  PreRequestScript: 'pre-request-script',
  PostRequestScript: 'post-request-script',
  TestScript: 'test-script',
};

export default function RequestInitializer() {
  const { current } = useRequestStore();
  const { setId, setUrl, setMethod, setHeaders, setBody } = useRequestConfig();
  const {
    setBody: setResponseBody,
    setHeaders: setResponseHeaders,
    setResponseSize,
    setResponseStatus,
    setResponseTime,
  } = useResponse();

  useEffect(() => {
    if (!current) {
      return;
    }

    setId(current.getPath());
    setUrl(current.getUrl());
    setMethod(current.getMethod());
    setHeaders(
      current.getHeaders().map((header) => ({
        key: header.key,
        value: header.value,
        enabled: true,
      })),
    );
    // @ts-expect-error
    setBody(current.getBody() ?? {});

    const res = current.getResponse();

    if (res) {
      setResponseBody(res.body);
      setResponseHeaders(
        res.headers.map((header) => ({
          key: header.key,
          value: header.value,
        })),
      );
      setResponseSize(res.size);
      setResponseStatus(res.status);
      setResponseTime(res.time);
    } else {
      setResponseBody('');
      setResponseHeaders([]);
      setResponseSize(0);
      setResponseStatus(0);
      setResponseTime(0);
    }
  }, [current]);

  return (
    <div>
      <RequestTabs />
      <div className="space-y-4 px-2 mt-2">
        <RequestInput />
        <Tabs defaultValue={ReqTabs.QueryParameters}>
          <TabsList>
            <TabsTrigger className="select-none" value={ReqTabs.QueryParameters}>
              Parameters
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.Headers}>
              Headers
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.RequestBody}>
              Body
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.PreRequestScript}>
              Pre-Request
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.PostRequestScript}>
              Post-Response
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.TestScript}>
              Tests
            </TabsTrigger>
          </TabsList>
          <TabsContent value={ReqTabs.QueryParameters}>
            <RequestParameters />
          </TabsContent>
          <TabsContent value={ReqTabs.Headers}>
            <RequestHeaders />
          </TabsContent>
          <TabsContent value={ReqTabs.RequestBody}>
            <RequestBody />
          </TabsContent>
          <TabsContent value={ReqTabs.PreRequestScript}>
            <PreRequestScript />
          </TabsContent>
          <TabsContent value={ReqTabs.PostRequestScript}>
            <PostRequestScript />
          </TabsContent>
          <TabsContent value={ReqTabs.TestScript}>
            <TestScript />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

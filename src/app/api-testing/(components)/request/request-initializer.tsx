'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestInput from './request-input';
import { RequestParameters } from './request-parameters';
import { RequestHeaders } from './request-headers';
import { RequestTabs } from './request-tabs';
import { RequestBody } from './request-body';
import {
  useRequestConfig,
  useRequestStore,
} from '@/stores/api-testing/request-config.store';
import { useEffect } from 'react';

const ReqTabs = {
  QueryParameters: 'query-parameters',
  Headers: 'headers',
  RequestBody: 'request-body',
  PreRequestScript: 'pre-request-script',
  PostRequestScript: 'post-request-script',
};

export default function RequestInitializer() {
  const { current } = useRequestStore();
  const { setId, setUrl, setMethod, setHeaders, setBody } = useRequestConfig();

  useEffect(() => {
    if (!current) return;

    setId(current.getPath());
    setUrl(current.getUrl());
    setMethod(current.getMethod());
    setHeaders(
      current.getHeaders().map((header) => ({
        key: header.key,
        value: header.value,
        enabled: true,
      }))
    );
    setBody(current.getBody() ?? '');
  }, [current]);

  return (
    <div>
      <RequestTabs />
      <div className="space-y-4 px-2 mt-2">
        <RequestInput />
        <Tabs defaultValue={ReqTabs.QueryParameters}>
          <TabsList>
            <TabsTrigger
              className="select-none"
              value={ReqTabs.QueryParameters}
            >
              Parameters
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.Headers}>
              Headers
            </TabsTrigger>
            <TabsTrigger className="select-none" value={ReqTabs.RequestBody}>
              Body
            </TabsTrigger>
            <TabsTrigger
              className="select-none"
              value={ReqTabs.PreRequestScript}
            >
              Pre-Request
            </TabsTrigger>
            <TabsTrigger
              className="select-none"
              value={ReqTabs.PostRequestScript}
            >
              Post-Request
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
            Pre-Request script
          </TabsContent>
          <TabsContent value={ReqTabs.PostRequestScript}>
            Post-Request script
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

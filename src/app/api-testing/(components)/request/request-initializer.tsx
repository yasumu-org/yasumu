'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestInput from './request-input';
import { RequestParameters } from './request-parameters';
import { RequestHeaders } from './request-headers';
import { RequestTabs } from './request-tabs';
import { RequestBody } from './request-body';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';

const ReqTabs = {
  QueryParameters: 'query-parameters',
  Headers: 'headers',
  RequestBody: 'request-body',
};

export default function RequestInitializer() {
  const requestMethod = useRequestConfig((state) => state.method);

  return (
    <div>
      <RequestTabs />
      <div className="space-y-4 px-2 mt-2">
        <RequestInput />
        <Tabs defaultValue={ReqTabs.RequestBody}>
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
            <TabsTrigger
              className="select-none"
              value={ReqTabs.RequestBody}
              disabled={['GET', 'HEAD', 'OPTIONS'].includes(requestMethod)}
            >
              Body
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
        </Tabs>
      </div>
    </div>
  );
}

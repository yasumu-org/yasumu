'use client';

import { AppView } from '@/components/layout/app-view';
import { Content } from '@/components/layout/content';
import RequestInitializer from './(components)/request/input/request-initializer';
import ResponseViewer from './(components)/response/response-viewer';
import HistoryTree from './(components)/files/history-tree';
import { useRequestConfig, useRequestStore } from '@/stores/api-testing/request-config.store';
import { useResponse } from '@/stores/api-testing/response.store';
import { useEffect } from 'react';

export default function Page() {
  const { current } = useRequestStore();
  const { applyRequestData, clearRequestData } = useRequestConfig();
  const { applyResponseData, clearResponseData } = useResponse();

  useEffect(() => {
    if (!current) {
      clearRequestData();
      clearResponseData();
      return;
    }

    applyRequestData(current);
    applyResponseData(current);
  }, [current]);

  return (
    <Content>
      <AppView
        tree={<HistoryTree />}
        editor={
          current ? (
            <RequestInitializer />
          ) : (
            <div className="grid place-items-center h-[50vh] opacity-50 text-xl font-semibold">
              Select a request to view request options.
            </div>
          )
        }
        output={
          current ? (
            <ResponseViewer />
          ) : (
            <div className="grid place-items-center h-[50vh] opacity-50 text-xl font-semibold">
              Select a request to view response data.
            </div>
          )
        }
        lazy={true}
      />
    </Content>
  );
}

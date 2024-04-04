import { createFileRoute } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { RequestInput } from '@/components/request/input';
import { RequestResult } from '@/components/request/result';
import { RequestRoutes } from '@/components/request/routes';
import { RequestContextProvider } from '@/context/RequestContext';

function Index() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel maxSize={20}>
        <RequestRoutes />
      </ResizablePanel>
      <ResizableHandle />
      <RequestContextProvider>
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel minSize={30} defaultSize={30}>
              <RequestInput />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={50} defaultSize={30}>
              <RequestResult />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </RequestContextProvider>
    </ResizablePanelGroup>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});

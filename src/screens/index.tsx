import { createFileRoute } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { RequestInput } from '@/components/request/input';
import { RequestResult } from '@/components/request/result';
import { RequestRoutes } from '@/components/request/routes';

function Index() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel maxSize={20}>
        <RequestRoutes />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={30} defaultSize={30}>
            <RequestInput />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={15}>
            <RequestResult />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});

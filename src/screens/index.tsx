import { createFileRoute } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { RequestedRoutes } from '@/components/interface/RoutesHistoryTree';
import { RequestInputOptions } from '@/components/interface/RequestInputOptions';
import { RequestResult } from '@/components/interface/ResponseViewer';
import { RequestInput } from '@/components/interface/RequestInput';

function Index() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel maxSize={20}>
        <RequestedRoutes />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={30} defaultSize={30}>
            <div className="p-2 space-y-2">
              <RequestInput />
              <RequestInputOptions />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={50} defaultSize={30}>
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

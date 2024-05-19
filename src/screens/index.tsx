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
import { useRequestStore } from '@/store/requestStore';

function Index() {
  const { title } = useRequestStore();
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel maxSize={20}>
        <RequestedRoutes />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          {title && (
            <div className="p-2 border-b">
              <h4 className="text-sm font-medium">{title}</h4>
            </div>
          )}
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

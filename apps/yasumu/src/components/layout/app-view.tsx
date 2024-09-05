'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useMounted } from '@/hooks/use-mounted';
import { useLayoutStore } from '@/stores/application/layout.store';
import { LoadingSpinner } from './loading';

interface IProps {
  tree: React.ReactNode;
  editor: React.ReactNode;
  output: React.ReactNode;
  lazy?: boolean;
}

export function AppView({ editor, output, tree, lazy }: IProps) {
  const mounted = useMounted();
  const { orientation } = useLayoutStore();

  if (lazy && !mounted) {
    return <LoadingSpinner />;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[96.5vh]">
      <ResizablePanel maxSize={20} minSize={15} defaultSize={15}>
        {tree}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction={orientation}>
          <ResizablePanel minSize={50} defaultSize={50}>
            {editor}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={45} defaultSize={45}>
            {output}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

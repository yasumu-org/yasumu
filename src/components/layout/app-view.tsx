import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

interface IProps {
  tree: React.ReactNode;
  editor: React.ReactNode;
  output: React.ReactNode;
}

export function AppView({ editor, output, tree }: IProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[96.5vh]">
      <ResizablePanel maxSize={20} minSize={15} defaultSize={15}>
        {tree}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
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

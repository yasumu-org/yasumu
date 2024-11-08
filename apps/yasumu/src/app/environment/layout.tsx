import LayoutGroup from '@/components/layout-group';
import { EnvironmentSidebar } from '@/components/sidebars/environment-sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function EnvironmentLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-environment-layout">
        <ResizablePanel defaultSize={30}>
          <EnvironmentSidebar className="hidden flex-1 md:flex max-h-screen w-full" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </LayoutGroup>
  );
}

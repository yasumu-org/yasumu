import LayoutGroup from '@/components/layout-group';
import { MailSidebar } from '@/components/sidebars/mail-sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function EmailLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-email-layout">
        <ResizablePanel defaultSize={30}>
          <MailSidebar className="hidden flex-1 md:flex max-h-screen w-full" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-email-layout-2">
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </LayoutGroup>
  );
}

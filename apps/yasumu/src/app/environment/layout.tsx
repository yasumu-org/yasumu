import LayoutGroup from '@/components/layout-group';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import { EnvironmentSidebar } from '@/components/sidebars/environment-sidebar';

export default function EnvironmentLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-environment-layout"
        left={<EnvironmentSidebar className="hidden flex-1 md:flex max-h-screen w-full" />}
        right={children}
      />
    </LayoutGroup>
  );
}

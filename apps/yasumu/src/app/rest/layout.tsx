import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <FileTreeSidebar className="font-sans max-w-[17%] w-full" collapsible="none" />
      {children}
      <div className="border-l flex items-center justify-center w-1/2">output</div>
    </LayoutGroup>
  );
}

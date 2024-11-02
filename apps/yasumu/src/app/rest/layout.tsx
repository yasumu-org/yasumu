import { FileTreeSidebar } from '@/components/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <FileTreeSidebar className="font-sans" collapsible="none" />
      {children}
    </LayoutGroup>
  );
}

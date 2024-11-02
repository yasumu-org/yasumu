import LayoutGroup from '@/components/layout-group';
import { MailSidebar } from '@/components/mail-sidebar';

export default function EmailLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <MailSidebar />
      {children}
    </LayoutGroup>
  );
}

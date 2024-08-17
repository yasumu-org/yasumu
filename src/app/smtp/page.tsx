import { Content } from '@/components/layout/content';
import { BootstrapSMTP } from './(components)/bootstrap';

export default function Page() {
  return (
    <Content>
      <h1 className="text-xl font-medium">SMTP Server</h1>
      <p>Local SMTP server for development and testing.</p>
      <BootstrapSMTP />
    </Content>
  );
}

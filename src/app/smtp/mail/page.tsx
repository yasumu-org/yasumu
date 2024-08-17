import { Content } from '@/components/layout/content';
import { Mail } from '../(components)/mail/mail';

export default function Page() {
  return (
    <Content>
      <Mail defaultLayout={[32, 48]} />
    </Content>
  );
}

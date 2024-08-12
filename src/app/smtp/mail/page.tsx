import { Content } from '@/components/layout/content';
import { Mail } from '../(components)/mail/mail';
import { mails } from './data';

export default function Page() {
  return (
    <Content>
      <Mail mails={mails} defaultLayout={[32, 48]} />
    </Content>
  );
}

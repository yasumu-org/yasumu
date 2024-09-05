import { Home, Settings, Mail, TestTube } from 'lucide-react';
import { GrGraphQl } from 'react-icons/gr';
import { SiSocketdotio } from 'react-icons/si';
import { SideNavMenu } from './side-nav-menu';
import { WebSocketIcon } from '../icons/websocket';
import { WithSmtpMetadata } from '../smtp/smtp-metadata';

export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 top-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 text-primary-foreground">
        <SideNavMenu unchecked link="/" name="Home" icon={<Home className="h-5 w-5 -500" />} />
        <SideNavMenu link="/api-testing" name="API Testing" icon={<TestTube className="h-5 w-5 -rotate-45" />} />
        <WithSmtpMetadata>
          <SideNavMenu link="/smtp" name="SMTP Server" icon={<Mail className="h-5 w-5" />} />
        </WithSmtpMetadata>
        <SideNavMenu link="/graphql" name="GraphQL" comingSoon icon={<GrGraphQl className="h-5 w-5" />} />
        <SideNavMenu link="/websocket" name="WebSocket" comingSoon icon={<WebSocketIcon className="h-5 w-5" />} />
        <SideNavMenu link="/socketio" name="Socket.IO" comingSoon icon={<SiSocketdotio className="h-5 w-5" />} />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <SideNavMenu link="/settings" name="Settings" icon={<Settings className="h-5 w-5" />} />
      </nav>
    </aside>
  );
}

import { Home, Settings, Mail, TestTube, PlugIcon } from 'lucide-react';
import { SideNavMenu } from './side-nav-menu';

export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 top-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <SideNavMenu link="/" name="Home" icon={<Home className="h-5 w-5" />} />
        <SideNavMenu link="/api-testing" name="API Testing" icon={<TestTube className="h-5 w-5 -rotate-45" />} />
        <SideNavMenu link="/smtp" name="SMTP Server" icon={<Mail className="h-5 w-5" />} />
        <SideNavMenu link="/plugins" name="Plugins" comingSoon icon={<PlugIcon className="h-5 w-5" />} />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <SideNavMenu link="/settings" name="Settings" icon={<Settings className="h-5 w-5" />} />
      </nav>
    </aside>
  );
}

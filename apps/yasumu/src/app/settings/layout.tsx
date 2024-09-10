import { Content } from '@/components/layout/content';
import { Separator } from '@/components/ui/separator';
import { SettingsSidebarNav } from './(components)/settings-sidebar-nav';
import React from 'react';

const sidebarNavItems = [
  {
    title: 'General',
    href: '/settings',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Environments',
    href: '/settings/environments',
  },
];

export default function SettingsLayout({ children }: React.PropsWithChildren) {
  return (
    <Content>
      <div className="hidden space-y-6 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your application settings and set preferences.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5 px-4">
            <SettingsSidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </Content>
  );
}

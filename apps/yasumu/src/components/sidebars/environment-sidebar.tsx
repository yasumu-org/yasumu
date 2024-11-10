'use client';
import React, { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from '../ui/sidebar';
import { FolderInput, Trash } from 'lucide-react';
import Link from 'next/link';
import { useYasumu } from '@/providers/WorkspaceProvider';
import { YasumuEnvironment } from '@yasumu/core/dist/workspace/environments/YasumuEnvironment';
import { YasumuWorkspaceEvents } from '@yasumu/core';

export function EnvironmentSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const yasumu = useYasumu();
  const [environments, setEnvironments] = React.useState<YasumuEnvironment[]>([]);

  useEffect(() => {
    setEnvironments(yasumu.workspace?.environments.getEnvironments() ?? []);

    const listener = () => {
      setEnvironments(yasumu.workspace?.environments.getEnvironments() ?? []);
    };

    yasumu.workspace?.events.on(YasumuWorkspaceEvents.EnvironmentCreated, listener);
    yasumu.workspace?.events.on(YasumuWorkspaceEvents.EnvironmentDeleted, listener);
    yasumu.workspace?.events.on(YasumuWorkspaceEvents.EnvironmentUpdated, listener);

    return () => {
      yasumu.workspace?.events.off(YasumuWorkspaceEvents.EnvironmentCreated, listener);
      yasumu.workspace?.events.off(YasumuWorkspaceEvents.EnvironmentDeleted, listener);
      yasumu.workspace?.events.off(YasumuWorkspaceEvents.EnvironmentUpdated, listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarContent className="zw-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex justify-between items-center mb-7">
              <h4 className="text-foreground/90 text-sm">Environments</h4>
              <div className="flex gap-2 items-center">
                <Trash className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
                <FolderInput className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
              </div>
            </div>

            {environments.map((env) => {
              return (
                <Link
                  key={env.id}
                  href={{
                    pathname: '/environment',
                    query: { env: env.id },
                  }}
                  className="flex flex-col items-start gap-2 whitespace-nowrap p-2 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span className="text-foreground">{env.name}</span>
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

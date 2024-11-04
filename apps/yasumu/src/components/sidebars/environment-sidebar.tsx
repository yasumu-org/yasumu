import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader } from '../ui/sidebar';
import { FolderInput, Trash } from 'lucide-react';

const data = ['Local', 'Testing'];

export function EnvironmentSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader className="gap-3.5 border-b-2 p-4">
        <div className="w-full items-center space-y-1">
          <h2 className="text-base font-medium text-foreground">Environments</h2>
          <p className="text-xs font-medium text-foreground/75">Manage environment of the workspace</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="zw-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex justify-between items-center mb-7">
              <h4 className="text-foreground/90 text-sm">Environment</h4>
              <div className="flex gap-2 items-center">
                <Trash className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
                <FolderInput className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
              </div>
            </div>

            {data.map((env) => {
              return (
                <a
                  href="#"
                  key={env}
                  className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-2 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span className="text-foreground">{env}</span>
                </a>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from '../ui/sidebar';
import { FolderInput, Trash } from 'lucide-react';
import Link from 'next/link';

const data = ['Local', 'Testing'];

export function EnvironmentSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" {...props}>
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
                <Link
                  key={env}
                  href={{
                    pathname: '/environment',
                    query: { env },
                  }}
                  className="flex flex-col items-start gap-2 whitespace-nowrap p-2 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span className="text-foreground">{env}</span>
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

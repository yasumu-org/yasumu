import * as React from 'react';
import { ChevronRight, File, Folder } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This is sample data.
const data = {
  tree: [
    // ['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
    // ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    // ['lib', ['util.ts']],
    // ['public', 'favicon.ico', 'vercel.svg'],
    // '.eslintrc.json',
    // '.gitignore',
    // 'next.config.js',
    // 'tailwind.config.js',
    // 'package.json',
    // 'README.md',
    {
      name: 'Users',
      children: [
        {
          name: 'List users',
          method: 'GET',
        },
        {
          name: 'Create user',
          method: 'POST',
        },
        {
          name: 'Update user',
          method: 'PUT',
        },
        {
          name: 'Delete user',
          method: 'DELETE',
        },
      ],
    },
    {
      name: 'Todos',
      children: [
        {
          name: 'List todos',
          method: 'GET',
        },
        {
          name: 'Create todo',
          method: 'POST',
        },
        {
          name: 'Update todo',
          method: 'PUT',
        },
        {
          name: 'Delete todo',
          method: 'DELETE',
        },
      ],
    },
    {
      name: 'Comments',
      children: [
        {
          name: 'List comments',
          method: 'GET',
        },
        {
          name: 'Create comment',
          method: 'POST',
        },
        {
          name: 'Update comment',
          method: 'PUT',
        },
        {
          name: 'Delete comment',
          method: 'DELETE',
        },
      ],
    },
    {
      name: 'Health check',
      method: 'GET',
    },
  ],
};

export function FileTreeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex justify-between w-full">
              <div>Requests</div>
              <div className="flex items-center gap-2">
                <Folder className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
                <File className="h-[0.9rem] w-[0.9rem] cursor-pointer hover:bg-zinc-700" />
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tree.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tree({ item }: { item: (typeof data.tree)[number] }) {
  const { name, method, children } = item;

  if (!children?.length) {
    return (
      <SidebarMenuButton className="data-[active=true]:bg-transparent text-xs">
        {/* <File /> */}
        {method && (
          <span
            className={cn({
              'text-green-500': method === 'GET',
              'text-blue-500': method === 'POST',
              'text-yellow-500': method === 'PATCH',
              'text-pink-500': method === 'PUT',
              'text-red-500': method === 'DELETE',
            })}
          >
            {method.slice(0, 3)}
          </span>
        )}
        {name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="text-xs">
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

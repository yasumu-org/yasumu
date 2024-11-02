import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SiGraphql } from 'react-icons/si';

const graphqlData = [
  {
    name: 'Account',
    children: [
      {
        name: 'Authenticate',
        children: [
          {
            name: 'Login',
            icon: () => <SiGraphql className="text-pink-500" />,
          },
          {
            name: 'Logout',
            icon: () => <SiGraphql className="text-pink-500" />,
          },
          {
            name: 'Register',
            icon: () => <SiGraphql className="text-pink-500" />,
          },
        ],
      },
      {
        name: 'Current user',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Update current user',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
    ],
  },
  {
    name: 'Comments',
    children: [
      {
        name: 'List comments',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Create comment',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Update comment',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Delete comment',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
    ],
  },
  {
    name: 'Users',
    children: [
      {
        name: 'List users',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Create user',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Update user',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Delete user',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
    ],
  },
  {
    name: 'Todo lists',
    children: [
      {
        name: 'List todos',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Create todo',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Update todo',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
      {
        name: 'Delete todo',
        icon: () => <SiGraphql className="text-pink-500" />,
      },
    ],
  },
  {
    name: 'Health check',
    icon: () => <SiGraphql className="text-pink-500" />,
  },
  {
    name: 'Ping',
    icon: () => <SiGraphql className="text-pink-500" />,
  },
];

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-graphql-layout">
        <ResizablePanel defaultSize={17}>
          <FileTreeSidebar fileTree={graphqlData} className="font-sans w-full" collapsible="none" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" autoSaveId="yasumu-graphql-layout-2">
            <ResizablePanel>{children}</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="flex items-center justify-center h-full">output</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </LayoutGroup>
  );
}

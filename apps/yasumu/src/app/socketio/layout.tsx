import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SiSocketdotio } from 'react-icons/si';

const graphqlData = [
  {
    name: 'Account',
    children: [
      {
        name: 'Authenticate',
        children: [
          {
            name: 'Login',
            icon: () => <SiSocketdotio />,
          },
          {
            name: 'Logout',
            icon: () => <SiSocketdotio />,
          },
          {
            name: 'Register',
            icon: () => <SiSocketdotio />,
          },
        ],
      },
      {
        name: 'Current user',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Update current user',
        icon: () => <SiSocketdotio />,
      },
    ],
  },
  {
    name: 'Comments',
    children: [
      {
        name: 'List comments',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Create comment',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Update comment',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Delete comment',
        icon: () => <SiSocketdotio />,
      },
    ],
  },
  {
    name: 'Users',
    children: [
      {
        name: 'List users',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Create user',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Update user',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Delete user',
        icon: () => <SiSocketdotio />,
      },
    ],
  },
  {
    name: 'Todo lists',
    children: [
      {
        name: 'List todos',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Create todo',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Update todo',
        icon: () => <SiSocketdotio />,
      },
      {
        name: 'Delete todo',
        icon: () => <SiSocketdotio />,
      },
    ],
  },
  {
    name: 'Health check',
    icon: () => <SiSocketdotio />,
  },
  {
    name: 'Ping',
    icon: () => <SiSocketdotio />,
  },
];

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-socketio-layout">
        <ResizablePanel defaultSize={17}>
          <FileTreeSidebar fileTree={graphqlData} className="font-sans w-full" collapsible="none" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" autoSaveId="yasumu-socketio-layout-2">
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

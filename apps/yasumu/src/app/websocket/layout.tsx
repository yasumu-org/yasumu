import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import WebSocketLogo from '@/components/assets/WebSocketLogo';

const websocketData = [
  {
    name: 'Account',
    children: [
      {
        name: 'Authenticate',
        children: [
          {
            name: 'Login',
            icon: () => <WebSocketLogo />,
          },
          {
            name: 'Logout',
            icon: () => <WebSocketLogo />,
          },
          {
            name: 'Register',
            icon: () => <WebSocketLogo />,
          },
        ],
      },
      {
        name: 'Current user',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Update current user',
        icon: () => <WebSocketLogo />,
      },
    ],
  },
  {
    name: 'Comments',
    children: [
      {
        name: 'List comments',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Create comment',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Update comment',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Delete comment',
        icon: () => <WebSocketLogo />,
      },
    ],
  },
  {
    name: 'Users',
    children: [
      {
        name: 'List users',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Create user',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Update user',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Delete user',
        icon: () => <WebSocketLogo />,
      },
    ],
  },
  {
    name: 'Todo lists',
    children: [
      {
        name: 'List todos',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Create todo',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Update todo',
        icon: () => <WebSocketLogo />,
      },
      {
        name: 'Delete todo',
        icon: () => <WebSocketLogo />,
      },
    ],
  },
  {
    name: 'Health check',
    icon: () => <WebSocketLogo />,
  },
  {
    name: 'Ping',
    icon: () => <WebSocketLogo />,
  },
];

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizablePanelGroup direction="horizontal" autoSaveId="yasumu-ws-layout">
        <ResizablePanel defaultSize={17}>
          <FileTreeSidebar fileTree={websocketData} className="font-sans w-full" collapsible="none" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" autoSaveId="yasumu-ws-layout-2">
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

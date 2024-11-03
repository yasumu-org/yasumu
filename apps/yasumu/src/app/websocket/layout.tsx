import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import WebSocketLogo from '@/components/assets/WebSocketLogo';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';

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
      <ResizableApplicationLayout
        id="yasumu-websocket-layout"
        left={<FileTreeSidebar fileTree={websocketData} className="font-sans w-full" collapsible="none" />}
        right={children}
        bottom={
          <div className="flex items-center justify-center font-mono font-bold text-lg text-blue-500 h-full">
            Output
          </div>
        }
      />
    </LayoutGroup>
  );
}

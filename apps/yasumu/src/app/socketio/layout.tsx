import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/LayoutGroup';
import { SiSocketdotio } from 'react-icons/si';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';

const socketIOData = [
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
      <ResizableApplicationLayout
        id="yasumu-socketio-layout"
        left={<FileTreeSidebar fileTree={socketIOData} className="font-sans w-full" collapsible="none" />}
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

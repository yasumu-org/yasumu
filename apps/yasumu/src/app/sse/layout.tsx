import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import { Zap } from 'lucide-react';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';

const sseData = [
  {
    name: 'Account',
    children: [
      {
        name: 'Authenticate',
        children: [
          {
            name: 'Login',
            icon: () => <Zap />,
          },
          {
            name: 'Logout',
            icon: () => <Zap />,
          },
          {
            name: 'Register',
            icon: () => <Zap />,
          },
        ],
      },
      {
        name: 'Current user',
        icon: () => <Zap />,
      },
      {
        name: 'Update current user',
        icon: () => <Zap />,
      },
    ],
  },
  {
    name: 'Comments',
    children: [
      {
        name: 'List comments',
        icon: () => <Zap />,
      },
      {
        name: 'Create comment',
        icon: () => <Zap />,
      },
      {
        name: 'Update comment',
        icon: () => <Zap />,
      },
      {
        name: 'Delete comment',
        icon: () => <Zap />,
      },
    ],
  },
  {
    name: 'Users',
    children: [
      {
        name: 'List users',
        icon: () => <Zap />,
      },
      {
        name: 'Create user',
        icon: () => <Zap />,
      },
      {
        name: 'Update user',
        icon: () => <Zap />,
      },
      {
        name: 'Delete user',
        icon: () => <Zap />,
      },
    ],
  },
  {
    name: 'Todo lists',
    children: [
      {
        name: 'List todos',
        icon: () => <Zap />,
      },
      {
        name: 'Create todo',
        icon: () => <Zap />,
      },
      {
        name: 'Update todo',
        icon: () => <Zap />,
      },
      {
        name: 'Delete todo',
        icon: () => <Zap />,
      },
    ],
  },
  {
    name: 'Health check',
    icon: () => <Zap />,
  },
  {
    name: 'Ping',
    icon: () => <Zap />,
  },
];

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-sse-layout"
        left={<FileTreeSidebar fileTree={sseData} className="font-sans w-full" collapsible="none" />}
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

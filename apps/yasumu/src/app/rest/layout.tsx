import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import {
  DeleteMethodIcon,
  GetMethodIcon,
  PatchMethodIcon,
  PostMethodIcon,
  PutMethodIcon,
} from '@/components/assets/HttpMethods';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';

const restData = [
  {
    name: 'Account',
    children: [
      {
        name: 'Authenticate',
        children: [
          {
            name: 'Login',
            icon: PostMethodIcon,
          },
          {
            name: 'Logout',
            icon: PostMethodIcon,
          },
          {
            name: 'Register',
            icon: PostMethodIcon,
          },
        ],
      },
      {
        name: 'Current user',
        icon: GetMethodIcon,
      },
      {
        name: 'Update current user',
        icon: PatchMethodIcon,
      },
    ],
  },
  {
    name: 'Comments',
    children: [
      {
        name: 'List comments',
        icon: GetMethodIcon,
      },
      {
        name: 'Create comment',
        icon: PostMethodIcon,
      },
      {
        name: 'Update comment',
        icon: PutMethodIcon,
      },
      {
        name: 'Delete comment',
        icon: DeleteMethodIcon,
      },
    ],
  },
  {
    name: 'Users',
    children: [
      {
        name: 'List users',
        icon: GetMethodIcon,
      },
      {
        name: 'Create user',
        icon: PostMethodIcon,
      },
      {
        name: 'Update user',
        icon: PutMethodIcon,
      },
      {
        name: 'Delete user',
        icon: DeleteMethodIcon,
      },
    ],
  },
  {
    name: 'Todo lists',
    children: [
      {
        name: 'List todos',
        icon: GetMethodIcon,
      },
      {
        name: 'Create todo',
        icon: PostMethodIcon,
      },
      {
        name: 'Update todo',
        icon: PutMethodIcon,
      },
      {
        name: 'Delete todo',
        icon: DeleteMethodIcon,
      },
    ],
  },
  {
    name: 'Health check',
    icon: GetMethodIcon,
  },
  {
    name: 'Ping',
    icon: GetMethodIcon,
  },
];

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-rest-layout"
        left={<FileTreeSidebar fileTree={restData} className="font-sans w-full" collapsible="none" />}
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

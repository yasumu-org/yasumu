import { FileTreeSidebar } from '@/components/sidebars/file-tree-sidebar';
import LayoutGroup from '@/components/layout-group';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import { WorkspaceModuleType } from '@yasumu/core';

const FileSystemTree = {
  children: [
    {
      children: [
        {
          name: 'Get comment by id',
          id: 'lJYJMcIkAPOFj55zmUOB6',
          method: 'GET',
          path: 'comments',
        },
        {
          name: 'Get all comments',
          id: 'Of2rL3Wdq5-K4_EvCBXTr',
          method: 'GET',
          path: 'comments',
        },
        {
          name: 'Create comment',
          id: 'MU9QUrebda1myS-5UTzAP',
          method: 'POST',
          path: 'comments',
        },
        {
          name: 'Update comment',
          id: '9XAvm8aN_PMBQXF1QgNIc',
          method: 'PUT',
          path: 'comments',
        },
        {
          name: 'Delete comment',
          id: 'aiGfn49jtBfxpUFV_DHAN',
          method: 'DELETE',
          path: 'comments',
        },
      ],
      name: 'comments',
      id: 'dir::3',
    },
    {
      children: [
        {
          name: 'Get todo by id',
          id: 'd037T_eOxon27caRcMbra',
          method: 'GET',
          path: 'todos',
        },
        {
          name: 'Get all todos',
          id: '5kip8SZhmnwZJcqy0lh3E',
          method: 'GET',
          path: 'todos',
        },
        {
          name: 'Create todo',
          id: 'txWqPN3sTUhNUaIIYjg7u',
          method: 'POST',
          path: 'todos',
        },
        {
          name: 'Update todo',
          id: '8DQh7VHL97cnj0wHIzeRi',
          method: 'PUT',
          path: 'todos',
        },
        {
          name: 'Delete todo',
          id: 'xH3PV0PC4dNQ7OgGA-VaA',
          method: 'DELETE',
          path: 'todos',
        },
        {
          children: [
            {
              name: 'Get todo by id',
              id: 'g9HHn0MDp6QRgGyAlhobd',
              method: 'GET',
              path: 'todos/get todo',
            },
          ],
          name: 'get todo',
          id: 'dir::1',
        },
      ],
      name: 'todos',
      id: 'dir::0',
    },
    {
      children: [
        {
          name: 'Get user by id',
          id: 'n2UDm1YkTLquN7N93jF9S',
          method: 'GET',
          path: 'users',
        },
        {
          name: 'Get all users',
          id: 'fq6l9a64Z0u6Ik_dnJHuq',
          method: 'GET',
          path: 'users',
        },
        {
          name: 'Create user',
          id: 'v0Rsju1pFTvDWaU7OxMqc',
          method: 'POST',
          path: 'users',
        },
        {
          name: 'Update user',
          id: 'DdDc5R1xx627Z8dlqLjGs',
          method: 'PUT',
          path: 'users',
        },
        {
          name: 'Delete user',
          id: 'viUWSYYBPguKDvMsn7i1M',
          method: 'DELETE',
          path: 'users',
        },
      ],
      name: 'users',
      id: 'dir::2',
    },
    {
      name: 'Ping',
      id: 'RqjrF9oTL4O2tuNsj5aNM',
      method: 'GET',
      path: '/',
    },
  ],
  id: '__YASUMU_ROOT__',
  name: '__YASUMU_ROOT__',
  __type: WorkspaceModuleType.Rest,
};

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-rest-layout"
        left={<FileTreeSidebar fileTree={FileSystemTree.children} className="font-sans w-full" collapsible="none" />}
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

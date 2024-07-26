import { TreeViewElement } from '@/components/magicui/file-tree';
import { HttpMethods } from '@/lib/constants';

interface Item {
  id: string;
  path: string;
  method: HttpMethods;
  name: string;
  url: string;
  body?: string;
}

const staticMockedData: Item[] = [
  // posts
  {
    id: crypto.randomUUID(),
    method: 'GET',
    name: 'Get post by id',
    path: 'Posts',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  },
  {
    id: crypto.randomUUID(),
    method: 'POST',
    name: 'Create post',
    path: 'Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1,
    }),
  },
  {
    id: crypto.randomUUID(),
    method: 'PUT',
    name: 'Update post',
    path: 'Posts',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    body: JSON.stringify({
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1,
    }),
  },
  {
    id: crypto.randomUUID(),
    method: 'DELETE',
    name: 'Delete post',
    path: 'Posts',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  },
  {
    id: crypto.randomUUID(),
    method: 'GET',
    name: 'Get all posts',
    path: 'Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
  },
  // todos
  {
    id: crypto.randomUUID(),
    method: 'POST',
    name: 'Create todo',
    path: 'Todos',
    url: 'https://jsonplaceholder.typicode.com/todos',
    body: JSON.stringify({
      title: 'foo',
      completed: false,
      userId: 1,
    }),
  },
  {
    id: crypto.randomUUID(),
    method: 'PUT',
    name: 'Update todo',
    path: 'Todos',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    body: JSON.stringify({
      id: 1,
      title: 'foo',
      completed: false,
      userId: 1,
    }),
  },
  {
    id: crypto.randomUUID(),
    method: 'DELETE',
    name: 'Delete todo',
    path: 'Todos',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
  },
  {
    id: crypto.randomUUID(),
    method: 'GET',
    name: 'Get all todos',
    path: 'Todos',
    url: 'https://jsonplaceholder.typicode.com/todos',
  },
];

export type TreeElements = Omit<TreeViewElement, 'children'> & {
  children?: TreeElements[];
  metadata: Item;
};

class IDatabase {
  getData() {
    return staticMockedData;
  }
  getDirectories() {
    return staticMockedData.map((item) => item.path!);
  }
  createTreeView(): TreeElements[] {
    const tree: TreeElements[] = [];

    for (const entry of staticMockedData) {
      const folder = tree.find((item) => item.id === entry.path);

      if (folder) {
        (folder.children ??= []).push({
          id: entry.id,
          name: entry.name,
          isSelectable: true,
          metadata: entry,
        });
      } else {
        tree.push({
          id: entry.path,
          name: entry.path,
          metadata: entry,
          children: [
            {
              id: entry.id,
              name: entry.name,
              isSelectable: true,
              metadata: entry,
            },
          ],
          isSelectable: true,
        });
      }
    }

    return tree;
  }
}

export const Database = new IDatabase();

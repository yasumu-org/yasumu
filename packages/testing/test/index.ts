import { yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/tree-test-workspace';

const workspace = await yasumu.openWorkspace({
  path: dir,
});

async function createRequests() {
  // root
  await workspace.rest.create({
    name: 'Ping',
    url: 'https://example.com',
  });

  // todos
  {
    await workspace.rest.create({
      name: 'Get todo by id',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      path: 'todos',
    });

    await workspace.rest.create({
      name: 'Get all todos',
      url: 'https://jsonplaceholder.typicode.com/todos',
      path: 'todos',
    });

    await workspace.rest.create({
      name: 'Create todo',
      url: 'https://jsonplaceholder.typicode.com/todos',
      method: 'POST',
      path: 'todos',
    });

    await workspace.rest.create({
      name: 'Update todo',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      method: 'PUT',
      path: 'todos',
    });

    await workspace.rest.create({
      name: 'Delete todo',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      method: 'DELETE',
      path: 'todos',
    });

    await workspace.rest.create({
      name: 'Get todo by id',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      path: 'todos/get todo',
    });
  }

  // users
  {
    await workspace.rest.create({
      name: 'Get user by id',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      path: 'users',
    });

    await workspace.rest.create({
      name: 'Get all users',
      url: 'https://jsonplaceholder.typicode.com/users',
      path: 'users',
    });

    await workspace.rest.create({
      name: 'Create user',
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'POST',
      path: 'users',
    });

    await workspace.rest.create({
      name: 'Update user',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      method: 'PUT',
      path: 'users',
    });

    await workspace.rest.create({
      name: 'Delete user',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      method: 'DELETE',
      path: 'users',
    });
  }

  // comments
  {
    await workspace.rest.create({
      name: 'Get comment by id',
      url: 'https://jsonplaceholder.typicode.com/comments/1',
      path: 'comments',
    });

    await workspace.rest.create({
      name: 'Get all comments',
      url: 'https://jsonplaceholder.typicode.com/comments',
      path: 'comments',
    });

    await workspace.rest.create({
      name: 'Create comment',
      url: 'https://jsonplaceholder.typicode.com/comments',
      method: 'POST',
      path: 'comments',
    });

    await workspace.rest.create({
      name: 'Update comment',
      url: 'https://jsonplaceholder.typicode.com/comments/1',
      method: 'PUT',
      path: 'comments',
    });

    await workspace.rest.create({
      name: 'Delete comment',
      url: 'https://jsonplaceholder.typicode.com/comments/1',
      method: 'DELETE',
      path: 'comments',
    });
  }
}

// await createRequests();

const Tree = await workspace.rest.generateTree();

console.dir(Tree, { depth: Infinity });

// const printTree = (tree: typeof Tree, level = 0) => {
//   console.log('  '.repeat(level) + `${tree.children ? '| ' : '- '}` + tree.name);

//   if (tree.children) {
//     for (const child of tree.children) {
//       printTree(child as any, level + 1);
//     }
//   }
// };

// Tree.children?.forEach((child) => {
//   printTree(child as any);
// });

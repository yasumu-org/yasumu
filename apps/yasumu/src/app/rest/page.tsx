'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HttpMethodSelector from './(components)/HttpMethodSelector';
import KeyValueTable from '../../components/KeyValueTable';
import { RequestTab, RequestTabs } from '../../components/RequestTabs';
import { Separator } from '@/components/ui/separator';
import {
  PostMethodIcon,
  DeleteMethodIcon,
  GetMethodIcon,
  HeadMethodIcon,
  PatchMethodIcon,
  PutMethodIcon,
} from '@/components/assets/HttpMethods';

const restDataTabs: RequestTab[] = [
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
  {
    name: 'Current user',
    icon: GetMethodIcon,
  },
  {
    name: 'Update current user',
    icon: PatchMethodIcon,
  },
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
  {
    name: 'Health check',
    icon: GetMethodIcon,
  },
  {
    name: 'Ping',
    icon: HeadMethodIcon,
  },
];

export default function Home() {
  return (
    <main className="w-full p-4 space-y-4">
      <div className="w-full overflow-auto zw-scrollbar">
        <RequestTabs tabs={restDataTabs} />
      </div>
      <div className="flex gap-4">
        <HttpMethodSelector />
        <Input placeholder="Enter a URL..." />
        <Button>Send</Button>
      </div>
      <Separator />
      <KeyValueTable />
    </main>
  );
}

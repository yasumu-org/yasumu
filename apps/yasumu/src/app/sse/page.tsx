'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import KeyValueTable from '../../components/KeyValueTable';
import { Separator } from '@/components/ui/separator';
import { RequestTab, RequestTabs } from '../../components/RequestTabs';
import { Zap } from 'lucide-react';

const icon = () => <Zap className="size-4" />;

export const graphqlDataTabs: RequestTab[] = [
  'Login',
  'Logout',
  'Register',
  'Current user',
  'Update current user',
  'List comments',
  'Create comment',
  'Update comment',
  'Delete comment',
  'List users',
  'Create user',
  'Update user',
  'Delete user',
  'List todos',
  'Create todo',
  'Update todo',
  'Delete todo',
  'Health check',
  'Ping',
].map((name) => ({
  icon,
  name,
}));

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <RequestTabs tabs={graphqlDataTabs} />
      <div className="flex gap-4">
        <Input placeholder="Enter a URL..." />
        <Button>Send</Button>
      </div>
      <Separator />
      <KeyValueTable value={{}} onChange={() => {}} />
    </main>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import KeyValueTable from '../../components/KeyValueTable';
import { Separator } from '@/components/ui/separator';
import { RequestTabs } from '../../components/RequestTabs';

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <RequestTabs tabs={[]} />
      <div className="flex gap-4">
        <Input placeholder="Enter a URL..." />
        <Button>Send</Button>
      </div>
      <Separator />
      <KeyValueTable value={{}} onChange={() => {}} />
    </main>
  );
}

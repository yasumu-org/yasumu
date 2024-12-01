'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HttpMethodSelector from './(components)/HttpMethodSelector';
import KeyValueTable from '../../components/KeyValueTable';
import { RequestTabs } from '../../components/RequestTabs';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="p-4 w-full h-full overflow-y-auto flex flex-col gap-4">
      <RequestTabs tabs={[]} />
      <div className="flex gap-4">
        <HttpMethodSelector />
        <Input placeholder="Enter a URL..." />
        <Button>Send</Button>
      </div>
      <Separator />
      <KeyValueTable value={{}} onChange={() => {}} />
    </main>
  );
}

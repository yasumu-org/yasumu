import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HttpMethodSelector from './(components)/HttpMethodSelector';
import KeyValueTable from './(components)/KeyValueTable';
import { RequestTabs } from './(components)/RequestTabs';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="w-full p-4 space-y-4">
      <div className="w-full overflow-auto zw-scrollbar">
        <RequestTabs />
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

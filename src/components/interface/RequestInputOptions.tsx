import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { MutableKVTable } from '../tables/MutableKeyValueTable';
import { RequestBodyEditor } from './RequestBodyEditor';

export function RequestInputOptions() {
  return (
    <Tabs defaultValue="parameters">
      <TabsList>
        {/* <TabsTrigger value="parameters">Parameters</TabsTrigger> */}
        <TabsTrigger value="headers">Headers</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
      </TabsList>
      <TabsContent value="parameters">
        <MutableKVTable />
      </TabsContent>
      <TabsContent value="headers">
        <MutableKVTable />
      </TabsContent>
      <TabsContent value="body">
        <RequestBodyEditor />
      </TabsContent>
    </Tabs>
  );
}

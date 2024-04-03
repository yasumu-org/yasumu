import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Body } from './body';
import { HeadersTable } from './headers';
import { ParameterTable } from './params';

export function Additionals() {
  return (
    <div className="p-2">
      <Tabs defaultValue="parameters">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>
        <TabsContent value="parameters">
          <ParameterTable />
        </TabsContent>
        <TabsContent value="headers">
          <HeadersTable />
        </TabsContent>
        <TabsContent value="body">
          <Body />
        </TabsContent>
      </Tabs>
    </div>
  );
}

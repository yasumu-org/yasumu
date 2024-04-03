import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Body } from './body';
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
          <ParameterTable name="Parameter" />
        </TabsContent>
        <TabsContent value="headers">
          <ParameterTable name="Header" />
        </TabsContent>
        <TabsContent value="body">
          <Body />
        </TabsContent>
      </Tabs>
    </div>
  );
}

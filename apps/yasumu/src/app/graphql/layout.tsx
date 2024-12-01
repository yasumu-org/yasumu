import LayoutGroup from '@/components/LayoutGroup';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import GraphqlOutput from './(components)/GraphqlOutput';
import { GraphqlFileTree } from './(components)/GraphqlFileTree';

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-graphql-layout"
        left={<GraphqlFileTree />}
        right={children}
        bottom={<GraphqlOutput />}
      />
    </LayoutGroup>
  );
}

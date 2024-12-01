import LayoutGroup from '@/components/LayoutGroup';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import { RestFileTree } from './(components)/RestFileTree';

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-rest-layout"
        left={<RestFileTree />}
        right={children}
        bottom={
          <div className="flex items-center justify-center font-mono font-bold text-lg text-blue-500 h-full">
            Output
          </div>
        }
      />
    </LayoutGroup>
  );
}

import LayoutGroup from '@/components/LayoutGroup';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import { WebSocketFileTree } from './(components)/WebSocketFileTree';
export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-websocket-layout"
        left={<WebSocketFileTree />}
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

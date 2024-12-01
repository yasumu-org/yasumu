import LayoutGroup from '@/components/LayoutGroup';
import { ResizableApplicationLayout } from '@/components/ResizableApplicationLayout';
import { SocketIOFileTree } from './(components)/SocketIOFileTree';

export default function RestLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutGroup>
      <ResizableApplicationLayout
        id="yasumu-socketio-layout"
        left={<SocketIOFileTree />}
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

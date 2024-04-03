import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createRootRoute({
  component: () => <RootRoute />,
});

function RootRoute() {
  useEffect(() => {
    const cleanup = appWindow.listen<{
      message: string;
      description: string;
    }>('show-toast', ({ payload }) => {
      toast(payload.message, {
        description: payload.description,
        action: {
          label: 'Close',
          onClick: () => {
            console.log('Toast closed');
          },
        },
      });
    });

    invoke('ready');

    return () => void cleanup.then((c) => c());
  }, []);

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

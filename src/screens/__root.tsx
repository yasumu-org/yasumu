import { useStorage } from '@/hooks/useStorage';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createRootRoute({
  component: () => <RootRoute />,
});

function RootRoute() {
  const store = useStorage();

  useEffect(() => {
    const cleanup = listen<{
      message: string;
      description: string;
    }>('show-toast', ({ payload }) => {
      toast(payload.message, {
        description: payload.description,
        dismissible: true,
      });
    });

    store
      .get('toast:welcome')
      .then((value) => {
        if (!value)
          return invoke('ready').then(() => store.set('toast:welcome', true));
      })
      .catch(() => {});

    return () => void cleanup.then((c) => c());
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}

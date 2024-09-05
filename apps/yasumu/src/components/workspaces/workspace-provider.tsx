'use client';

import { useWorkspaceStore } from '@/stores/application/workspace.store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from '../layout/loading';
import { Yasumu } from '@/lib/yasumu';

export function YasumuWorkspaceProvider({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const { currentWorkspace, currentWorkspaceName, setCurrentWorkspace, setCurrentWorkspaceName } = useWorkspaceStore();

  const router = useRouter();

  const handleWorkspace = useCallback(async () => {
    try {
      const session = await Yasumu.restoreWorkspace();

      if (session) {
        setCurrentWorkspace(session.getPath());
        setCurrentWorkspaceName(session.metadata.name);

        document.title = `Yasumu - ${session.metadata.name}`;
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentWorkspace && currentWorkspaceName) return setLoading(false);

    handleWorkspace();
  }, []);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
}

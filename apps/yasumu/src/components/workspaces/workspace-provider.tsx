'use client';

import { useWorkspaceStore } from '@/stores/application/workspace.store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from '../layout/loading';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';
import { useEnvironmentLoader } from '@/hooks/use-environment-loader';

export function YasumuWorkspaceProvider({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const { currentWorkspace, currentWorkspaceName, setCurrentWorkspace, setCurrentWorkspaceName } = useWorkspaceStore();
  const { reloadEnv } = useEnvironmentLoader();

  const router = useRouter();

  const handleWorkspace = useCallback(async () => {
    try {
      const session = await Yasumu.restoreWorkspace();

      if (session) {
        setCurrentWorkspace(session.getPath());
        setCurrentWorkspaceName(session.metadata.name);

        document.title = `Yasumu - ${session.metadata.name}`;

        await reloadEnv().catch((e) => {
          toast.error('Failed to load environments', {
            description: String(e),
          });
        });
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

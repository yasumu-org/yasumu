'use client';

import { useWorkspaceStore } from '@/stores/application/workspace.store';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { GetStartedAction } from '../cards/get-started-action';
import Link from 'next/link';
import { Yasumu } from '@/lib/api/yasumu';
import { YasumuWorkspaceHistory } from '@/lib/api/workspace/YasumuWorkspace';

export function YasumuWorkspace() {
  const [recentWorkspaces, setRecentWorkspaces] = useState<YasumuWorkspaceHistory[]>([]);
  const { currentWorkspace, setCurrentWorkspace, currentWorkspaceName, setCurrentWorkspaceName } = useWorkspaceStore();

  useEffect(() => {
    Yasumu.getWorkspacesHistory().then((data) => setRecentWorkspaces(data), console.error);
  }, []);

  const handleWorkspaceCreate = useCallback(async (path?: string) => {
    try {
      const res =
        path ??
        (await open({
          directory: true,
          multiple: false,
          title: 'Open Yasumu Workspace',
          canCreateDirectories: true,
        }));

      if (res) {
        const workspace = await Yasumu.openWorkspace(res);

        setCurrentWorkspace(res);
        setCurrentWorkspaceName(workspace.metadata.name);
      }
    } catch (e) {
      toast.error('Failed to open workspace', {
        description: String(e),
      });
    }
  }, []);

  return (
    <>
      {currentWorkspace ? (
        <>
          <p className="text-muted-foreground">
            Currently on workspace - <span className="text-primary font-medium">{currentWorkspaceName}</span>. Select an
            action to get started.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4">
            <GetStartedAction
              title="API Testing"
              description="Get started by testing your REST API"
              action={
                <Link href="/api-testing">
                  <Button>Get started</Button>
                </Link>
              }
            />
            <GetStartedAction
              title="SMTP Server"
              description="Spin up a fake SMTP server for testing"
              action={
                <Link href="/smtp">
                  <Button>Get started</Button>
                </Link>
              }
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">Open a workspace to get started.</p>
          <div className="mt-4">
            <Button onClick={() => handleWorkspaceCreate()}>Open Workspace</Button>
            <div className="mt-8 space-y-2">
              <h2 className="text-lg font-semibold">Recent workspaces:</h2>
              {recentWorkspaces.length ? (
                <>
                  <ul className="pl-4">
                    {recentWorkspaces.map((workspace) => (
                      <li key={workspace.path} className="list-disc text-primary list-inside">
                        <Button variant="link" size="sm" onClick={() => setCurrentWorkspace(workspace.path)}>
                          {workspace.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      Yasumu.clearWorkspacesHistory().then(() => {
                        setRecentWorkspaces([]);
                      });
                    }}
                  >
                    Clear recent workspaces
                  </Button>
                </>
              ) : (
                <p>No recent workspaces found!</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

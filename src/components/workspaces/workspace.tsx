'use client';

import { useWorkspaceStore } from '@/stores/application/workspace.store';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { GetStartedAction } from '../cards/get-started-action';
import Link from 'next/link';
import { Yasumu } from '@/lib/yasumu';
import { YasumuWorkspaceHistory } from '@yasumu/core';
import { Separator } from '../ui/separator';
import { Trash2 } from 'lucide-react';

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
        (await Yasumu.dialog.open({
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
          <p className="text-muted-foreground text-xl">
            You are currently on workspace <span className="text-primary font-medium">{currentWorkspaceName}</span>.
          </p>

          <div className="space-y-4">
            <Separator className="my-4" />
            <h2 className="text-lg font-semibold">Get started:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
              <GetStartedAction
                title="GraphQL"
                comingSoon
                description="Interactive GraphQL playground"
                action={
                  <Link href="/graphql">
                    <Button>Get started</Button>
                  </Link>
                }
              />
              <GetStartedAction
                title="WebSocket"
                comingSoon
                description="Interactive WebSocket playground"
                action={
                  <Link href="/websocket">
                    <Button>Get started</Button>
                  </Link>
                }
              />
              <GetStartedAction
                title="Socket.IO"
                comingSoon
                description="Interactive Socket.IO playground"
                action={
                  <Link href="/socketio">
                    <Button>Get started</Button>
                  </Link>
                }
              />
            </div>
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
                  <ul>
                    {recentWorkspaces.map((workspace) => (
                      <li key={workspace.path}>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleWorkspaceCreate(workspace.path)}
                          className="text-muted-foreground"
                        >
                          {workspace.path}
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      Yasumu.clearWorkspacesHistory().then(() => {
                        setRecentWorkspaces([]);
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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

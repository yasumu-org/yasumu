'use client';

import { FilePlus2, FolderPlus } from 'lucide-react';
import { useCallback } from 'react';
import { FsActionDialog } from './fs-action-dialog';
import { Yasumu } from '@/lib/yasumu';
import { HttpMethods } from '@yasumu/core';
import { toast } from 'sonner';
import { useRequestFs, useRequestStore } from '@/stores/api-testing/request-config.store';

export function FsActionManager() {
  const { setCurrent } = useRequestStore();
  const { selectedPath } = useRequestFs();

  const handleCreateFolder = useCallback(
    async (name: string) => {
      try {
        if (!Yasumu.workspace) return;
        await Yasumu.workspace.rest.create(name, null, selectedPath || undefined);
      } catch (e) {
        toast.error('Failed to create group', {
          description: String(e),
        });
      }
    },
    [selectedPath],
  );

  const handleCreateFile = useCallback(
    async (name: string) => {
      try {
        if (!Yasumu.workspace) return;
        const entity = await Yasumu.workspace.rest.create(name, HttpMethods.GET, selectedPath || undefined);
        setCurrent(entity);
      } catch (e) {
        toast.error('Failed to create request', {
          description: String(e),
        });
      }
    },
    [selectedPath],
  );

  return (
    <div className="flex items-center gap-1 pr-4">
      <FsActionDialog type="Request" onCreate={handleCreateFile} description="Create a new request.">
        <FilePlus2 className="h-6 w-6" />
      </FsActionDialog>
      <FsActionDialog
        type="Group"
        onCreate={handleCreateFolder}
        description="Groups are like a directory, allowing you to group similar requests."
      >
        <FolderPlus className="h-6 w-6" />
      </FsActionDialog>
    </div>
  );
}

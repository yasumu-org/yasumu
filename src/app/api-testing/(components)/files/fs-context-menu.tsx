'use client';

import React, { useCallback, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2 } from 'lucide-react';
import { ConfirmationDialog, ContextMenuFsActionDialog } from './context-menu-fs-action-dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TreeViewElement } from '@/components/magicui/file-tree';
import { Yasumu } from '@/lib/yasumu';
import { YasumuRestEntity } from '@yasumu/core';
import { toast } from 'sonner';
import { useRequestFs } from '@/stores/api-testing/request-config.store';

export function FsContextMenu({
  children,
  isFile,
  onDelete,
  item,
  onOpenExternal,
}: React.PropsWithChildren<{
  isFile?: boolean;
  item: TreeViewElement;
  onNewFile?: (name: string) => void;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onOpenExternal?: () => void;
}>) {
  const { setCopied, setCut, copied, cut } = useRequestFs();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  const handleUpdate = useCallback(
    async (name: string) => {
      if (!Yasumu.workspace) return;

      try {
        if (isUpdate) {
          await Yasumu.workspace.rest.rename(item.id, name, !isFile);
        } else {
          await Yasumu.workspace.rest.create(
            name,
            // @ts-ignore
            isGroup ? null : HttpMethods.GET,
            item.id,
          );
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to create the item.', {
          description: String(e),
        });
      } finally {
        setIsUpdate(false);
        setIsGroup(false);
      }
    },
    [item, isFile, isUpdate, isGroup],
  );

  return (
    <ConfirmationDialog
      title="Are you absolutely sure?"
      description="Deleted items cannot be recovered and are forever lost. Do you want to continue?"
      onConfirm={onDelete}
    >
      <ContextMenuFsActionDialog
        value={isUpdate && isFile ? (YasumuRestEntity.getName(item.name) ?? '') : ''}
        description={`${isUpdate ? 'Rename' : 'Create'} the request${isGroup ? ' group' : ''}`}
        type={isGroup ? 'Request Group' : 'Request'}
        onCreate={handleUpdate}
        buttonName={isUpdate ? 'Rename' : 'Create'}
      >
        <ContextMenu>
          <ContextMenuTrigger>{children}</ContextMenuTrigger>
          <ContextMenuContent className="w-[200px]">
            {!isFile && (
              <>
                <DialogTrigger asChild>
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setIsGroup(false);
                      setIsUpdate(false);
                    }}
                  >
                    New Request
                  </ContextMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setIsGroup(true);
                      setIsUpdate(false);
                    }}
                  >
                    New Request Group
                  </ContextMenuItem>
                </DialogTrigger>
              </>
            )}
            <ContextMenuItem className="cursor-pointer" onClick={onOpenExternal}>
              Open in File Explorer
            </ContextMenuItem>
            <DialogTrigger asChild>
              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setIsUpdate(true);
                }}
              >
                Rename
              </ContextMenuItem>
            </DialogTrigger>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={async () => {
                setCopied(item.id);
                setCut(null);
              }}
            >
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={async () => {
                setCut(item.id);
                setCopied(null);
              }}
            >
              Cut
            </ContextMenuItem>
            {!isFile && (
              <ContextMenuItem
                className="cursor-pointer"
                disabled={!copied && !cut}
                onClick={async () => {
                  if (!Yasumu.workspace) return;

                  try {
                    if (copied) {
                      await Yasumu.workspace.rest.copy(copied, item.id);
                    } else if (cut) {
                      await Yasumu.workspace.rest.move(cut, item.id);
                      setCut(null);
                    }
                  } catch (e) {
                    console.error(e);
                    toast.error('Failed to paste the item.', {
                      description: String(e),
                    });
                  }
                }}
              >
                Paste
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <AlertDialogTrigger asChild>
              <ContextMenuItem className="text-destructive inline-flex gap-1 w-full cursor-pointer">
                <Trash2 className="h-4 w-4" /> Delete
              </ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuFsActionDialog>
    </ConfirmationDialog>
  );
}

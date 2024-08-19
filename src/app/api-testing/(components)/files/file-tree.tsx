'use client';

import { FileUI } from '@/components/fs/http/file';
import { Folder, TreeViewElement } from '@/components/magicui/file-tree';
import { YasumuRestEntity } from '@yasumu/core';
import { Yasumu } from '@/lib/yasumu';
import { useRequestFs, useRequestStore } from '@/stores/api-testing/request-config.store';
import { toast } from 'sonner';
import { FsContextMenu } from './fs-context-menu';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useRequestHistory } from '@/stores/api-testing/request-history.store';
import { open } from '@tauri-apps/plugin-shell';

export function RecursiveTreeGenerator({ tree }: { tree: TreeViewElement[] }) {
  const { setCurrent, current } = useRequestStore();
  const { cut, selectedPath, setSelectedPath } = useRequestFs();
  const { addHistory, removeHistoryByPath } = useRequestHistory();

  const handleDelete = useCallback((path: string) => {
    if (!Yasumu.workspace) return;
    Yasumu.workspace.rest.delete(path).then(
      () => {
        removeHistoryByPath(path);
        toast.success('Successfully deleted the item.');
      },
      (e) => {
        toast.error('Failed to delete the item.', {
          description: String(e),
        });
      },
    );
  }, []);

  return (
    <>
      {tree.map((item) => {
        const isDir = Array.isArray(item.children);

        if (isDir) {
          return (
            <FsContextMenu
              key={item.id}
              onDelete={() => handleDelete(item.id)}
              item={item}
              onOpenExternal={() => {
                Yasumu.shell.open(item.id).catch((e) => {
                  toast.error('Failed to open the file explorer', {
                    description: String(e),
                  });
                });
              }}
            >
              <Folder
                value={item.id}
                element={item.name}
                className={cn({
                  'text-orange-300': current?.getPath() === item.id || selectedPath === item.id,
                  'text-blue-400': cut === item.id,
                })}
                onClick={() => {
                  setSelectedPath(item.id);
                }}
              >
                {item.children?.length ? <RecursiveTreeGenerator tree={item.children} /> : null}
              </Folder>
            </FsContextMenu>
          );
        }

        return (
          <FsContextMenu
            key={item.id}
            isFile
            item={item}
            onDelete={() => handleDelete(item.id)}
            onOpenExternal={async () => {
              try {
                const dirname = await Yasumu.path.dirname(item.id);
                await Yasumu.shell.open(dirname).catch((e) => {
                  toast.error('Failed to open the file explorer', {
                    description: String(e),
                  });
                });
              } catch {
                //
              }
            }}
          >
            <FileUI
              value={item.id}
              method={YasumuRestEntity.getMethod(item.name)}
              className={cn({
                'text-orange-300': current?.getPath() === item.id || selectedPath === item.id,
                'text-blue-300': item.id === cut,
              })}
              handleSelect={async () => {
                try {
                  const path = await Yasumu.path.dirname(item.id);
                  setSelectedPath(path);
                } catch {
                  //
                }

                try {
                  if (!Yasumu.workspace) return;
                  const file = await Yasumu.workspace.rest.open(item.id);
                  if (!file) return;

                  addHistory(file);
                  setCurrent(file);
                } catch (e) {
                  toast.error('Failed to read the request data', {
                    description: String(e),
                  });
                }
              }}
            >
              {YasumuRestEntity.getName(item.name)}
            </FileUI>
          </FsContextMenu>
        );
      })}
    </>
  );
}

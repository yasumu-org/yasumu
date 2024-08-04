'use client';

import { FileUI } from '@/components/fs/http/file';
import { Folder, TreeViewElement } from '@/components/magicui/file-tree';
import { YasumuRestEntity } from '@/lib/api/workspace/modules/rest/YasumuRestEntity';
import { Yasumu } from '@/lib/api/yasumu';
import {
  useRequestFs,
  useRequestStore,
} from '@/stores/api-testing/request-config.store';
import { dirname } from '@tauri-apps/api/path';
import { toast } from 'sonner';
import { FsContextMenu } from './fs-context-menu';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export function RecursiveTreeGenerator({ tree }: { tree: TreeViewElement[] }) {
  const { setCurrent, current } = useRequestStore();
  const { cut, selectedPath, setSelectedPath } = useRequestFs();

  const handleDelete = useCallback((path: string) => {
    if (!Yasumu.workspace) return;
    Yasumu.workspace.rest.delete(path).then(
      () => {
        toast.success('Successfully deleted the item.');
      },
      (e) => {
        toast.error('Failed to delete the item.', {
          description: String(e),
        });
      }
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
            >
              <Folder
                value={item.id}
                element={item.name}
                className={cn({
                  'text-orange-300':
                    current?.getPath() === item.id || selectedPath === item.id,
                  'text-blue-400': cut === item.id,
                })}
                onClick={() => {
                  setSelectedPath(item.id);
                }}
              >
                {item.children?.length ? (
                  <RecursiveTreeGenerator tree={item.children} />
                ) : null}
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
          >
            <FileUI
              value={item.id}
              method={YasumuRestEntity.getMethod(item.name)}
              className={cn({
                'text-orange-300':
                  current?.getPath() === item.id || selectedPath === item.id,
                'text-blue-300': item.id === cut,
              })}
              handleSelect={async () => {
                try {
                  const path = await dirname(item.id);
                  setSelectedPath(path);
                } catch {
                  //
                }

                try {
                  if (!Yasumu.workspace) return;
                  const file = await Yasumu.workspace.rest.open(item.id);
                  if (!file) return;

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

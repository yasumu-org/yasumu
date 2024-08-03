'use client';

import { FileUI } from '@/components/fs/http/file';
import { Folder, TreeViewElement } from '@/components/magicui/file-tree';
import { YasumuRestEntity } from '@/lib/api/workspace/modules/rest/YasumuRestEntity';
import { Yasumu } from '@/lib/api/yasumu';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { toast } from 'sonner';

export function RecursiveTreeGenerator({ tree }: { tree: TreeViewElement[] }) {
  const { setCurrent } = useRequestStore();

  return (
    <>
      {tree.map((item) => {
        const isDir = Array.isArray(item.children);

        if (isDir) {
          return (
            <Folder key={item.id} value={item.id} element={item.name}>
              {item.children?.length && (
                <RecursiveTreeGenerator tree={item.children} />
              )}
            </Folder>
          );
        }

        return (
          <FileUI
            key={item.id}
            value={item.id}
            method={YasumuRestEntity.getMethod(item.name)}
          >
            <button
              onClick={async () => {
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
            </button>
          </FileUI>
        );
      })}
    </>
  );
}

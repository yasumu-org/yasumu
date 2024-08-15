'use client';
import { Tree, TreeViewElement } from '@/components/magicui/file-tree';
import { RecursiveTreeGenerator } from './file-tree';
import { FsActionManager } from './fs-action-manager';
import { useCallback, useEffect, useState } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';

export default function HistoryTree() {
  const [tree, setTree] = useState<TreeViewElement[]>([]);

  const loadTree = useCallback((silent = false) => {
    Yasumu.workspace?.rest.getAsTree().then(
      (tree) => {
        setTree(tree);
      },
      (e) => {
        if (silent) return;
        toast.error('Failed to load requests', {
          description: String(e),
        });
      },
    );
  }, []);

  useEffect(() => {
    loadTree();

    const path = Yasumu.workspace?.rest.getPath();

    if (path) {
      const unwatch = Yasumu.fs.watch(
        path,
        async () => {
          await loadTree(true);
        },
        {
          delayMs: 500,
          recursive: true,
        },
      );

      return () => void unwatch.then((u) => u()).catch(Object);
    }
  }, []);

  return (
    <div className="max-h-[96.5vh] overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Requests</h3>
        <FsActionManager />
      </div>
      {tree.map((item) => (
        <Tree key={item.id} className="py-1 overflow-hidden rounded-md" elements={item.children ?? []}>
          <RecursiveTreeGenerator tree={Array.isArray(item) ? item : [item]} />
        </Tree>
      ))}
    </div>
  );
}

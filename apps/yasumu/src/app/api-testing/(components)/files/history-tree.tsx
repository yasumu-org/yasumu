'use client';
import { Tree, TreeViewElement } from '@/components/magicui/file-tree';
import { RecursiveTreeGenerator } from './file-tree';
import { FsActionManager } from './fs-action-manager';
import { useCallback, useEffect, useState } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';
import { FullAreaContextMenu } from './full-area-context-menu';
import { useRequestHistory } from '@/stores/api-testing/request-history.store';
import { useRequestStore } from '@/stores/api-testing/request-config.store';

export default function HistoryTree() {
  const { current, setCurrent } = useRequestStore();
  const { setHistory } = useRequestHistory();
  const [tree, setTree] = useState<TreeViewElement[]>([]);

  useEffect(() => {
    Yasumu.workspace?.rest.getLastOpenedRequest().then((data) => {
      if (!current && data) setCurrent(data);
    }, console.error);
  }, []);

  const loadTree = useCallback((silent = false) => {
    Yasumu.workspace?.rest.getAsTree().then(
      (tree) => {
        setTree(tree);
        Yasumu.workspace?.rest.getLastOpenedRequests().then((data) => {
          setHistory(data);
        }, console.error);
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
    <>
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
      <FullAreaContextMenu />
    </>
  );
}

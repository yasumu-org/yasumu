'use client';

import { FileUI } from '@/components/fs/http/file';
import { Folder, TreeViewElement } from '@/components/magicui/file-tree';
import { YasumuRestEntity } from '@yasumu/core';
import { Yasumu } from '@/lib/yasumu';
import { useRequestConfig, useRequestFs, useRequestStore } from '@/stores/api-testing/request-config.store';
import { toast } from 'sonner';
import { FsContextMenu } from './fs-context-menu';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRequestHistory } from '@/stores/api-testing/request-history.store';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import { useResponse } from '@/stores/api-testing/response.store';

function FileTreeItem(item: TreeViewElement) {
  const { setCurrent, current } = useRequestStore();
  const { setScript: setRequestScript } = useRequestConfig();
  const { setScript, setTest } = useResponse();
  const { cut, selectedPath, setSelectedPath, setCopied, setCut, copied } = useRequestFs();
  const { addHistory, removeHistoryByPath } = useRequestHistory();

  const selectedItem = useRef<TreeViewElement | null>(null);

  useEffect(() => {
    if (!current) {
      setRequestScript('');
      setScript('');
      setTest('');
      return;
    }

    setRequestScript(current.getPreRequestScript());
    setScript(current.getPostResponseScript());
    setTest(current.getTestScript());
  }, [current]);

  const handleCopy = () => {
    if (!selectedItem.current) return;
    setCopied(selectedItem?.current.id);
    setCut(null);
  };

  const handlePaste = () => {
    if (!Yasumu.workspace || !selectedItem.current) return;
    try {
      if (copied) {
        Yasumu.workspace.rest.copy(copied, selectedItem.current.id);
      } else if (cut) {
        Yasumu.workspace.rest.move(cut, selectedItem.current.id);
        setCut(null);
      }
    } catch (e) {
      toast.error('Failed to paste the item.', {
        description: String(e),
      });
    }
  };
  const handleCut = () => {
    if (!selectedItem.current) return;
    setCut(selectedItem.current.id);
    setCopied(null);
  };

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

  useKeyboardShortcuts({
    onCopy: handleCopy,
    onCut: handleCut,
    onPaste: handlePaste,
  });

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
            setCurrent(null);
            selectedItem.current = item;
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
            selectedItem.current = item;
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
}

export function RecursiveTreeGenerator({ tree }: { tree: TreeViewElement[] }) {
  return (
    <>
      {tree.map((item) => (
        <FileTreeItem key={item.id} {...item} />
      ))}
    </>
  );
}

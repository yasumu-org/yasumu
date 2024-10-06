import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { DialogTrigger } from '@/components/ui/dialog';
import { ContextMenuFsActionDialog } from '@/app/api-testing/(components)/files/context-menu-fs-action-dialog';
import { useState } from 'react';
import { useRequestFs, useRequestStore } from '@/stores/api-testing/request-config.store';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';
import { HttpMethods } from '@yasumu/core';

export function FullAreaContextMenu() {
  const { setFocused } = useRequestStore();
  const [isGroup, setIsGroup] = useState(false);
  const { copied, cut, setCut } = useRequestFs();
  const handleCreate = async (name: string) => {
    if (!Yasumu.workspace) return;

    try {
      // @ts-ignore
      await Yasumu.workspace.rest.create(name, isGroup ? null : HttpMethods.GET);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create the item.', {
        description: String(e),
      });
    }
  };

  const rootPath = Yasumu.workspace?.rest.getPath();
  return (
    <ContextMenuFsActionDialog
      type={isGroup ? 'Request Group' : 'Request'}
      onCreate={handleCreate}
      buttonName="Create"
      description={`Create the request${isGroup ? ' group' : ''}`}
    >
      <ContextMenu>
        <ContextMenuTrigger
          onClick={() => {
            setFocused(null);
          }}
        >
          <div className="h-full"></div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[200px]">
          <>
            <DialogTrigger asChild>
              <ContextMenuItem className="cursor-pointer" onClick={() => setIsGroup(false)}>
                New Request
              </ContextMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              <ContextMenuItem className="cursor-pointer" onClick={() => setIsGroup(true)}>
                New Request Group
              </ContextMenuItem>
            </DialogTrigger>

            <ContextMenuItem
              className="cursor-pointer"
              disabled={!copied && !cut}
              onClick={async () => {
                if (!Yasumu.workspace) return;

                try {
                  if (copied && rootPath) {
                    await Yasumu.workspace.rest.copy(copied, rootPath);
                  } else if (cut && rootPath) {
                    await Yasumu.workspace.rest.move(cut, rootPath);
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
          </>
        </ContextMenuContent>
      </ContextMenu>
    </ContextMenuFsActionDialog>
  );
}

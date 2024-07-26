'use client';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { useResponse } from '@/stores/api-testing/response.store';
import { Folder, Tree } from '@/components/magicui/file-tree';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FilePlus2, FolderPlus } from 'lucide-react';
import { FileUI } from '@/components/fs/http/file';
import { Database, TreeElements } from '@/lib/mock/requests';

function FileSystemAction({
  name,
  icon,
}: {
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <Tooltip delayDuration={30}>
      <TooltipTrigger className="w-fit hover:bg-muted-foreground/30 p-1">
        {icon}
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

const requests = Database.createTreeView();

export default function HistoryTree() {
  return (
    <div className="max-h-[96.5vh] overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Requests</h3>
        <div className="flex items-center gap-1 pr-4">
          <FileSystemAction
            name="Create new group"
            icon={<FolderPlus className="h-4 w-4" />}
          />
          <FileSystemAction
            name="Create new request"
            icon={<FilePlus2 className="h-4 w-4" />}
          />
        </div>
      </div>
      <Tree
        className="py-2 overflow-hidden rounded-md"
        initialSelectedId="2"
        initialExpandedItems={requests.map((item) => item.id)}
        elements={requests}
      >
        <RecursiveTreeGenerator tree={requests} />
      </Tree>
    </div>
  );
}

function RecursiveTreeGenerator({ tree }: { tree: TreeElements[] }) {
  const { setUrl, setMethod, setBody, setId } = useRequestConfig();
  const { setBody: setResponseBody } = useResponse();

  return (
    <>
      {tree.map((item) => {
        const isDir = Array.isArray(item.children);

        if (isDir) {
          return (
            <Folder key={item.id} value={item.id} element={item.name}>
              {item.children?.map((child) => {
                if (child.children?.length) {
                  return <RecursiveTreeGenerator tree={child.children} />;
                }

                return (
                  <FileUI
                    key={child.id}
                    value={child.id}
                    method={child.metadata.method}
                  >
                    <button
                      onClick={() => {
                        setId(child.id);
                        setUrl(child.metadata.url);
                        setMethod(child.metadata.method);
                        setBody(child.metadata.body ?? '');
                        setResponseBody('');
                      }}
                    >
                      {child.name}
                    </button>
                  </FileUI>
                );
              })}
            </Folder>
          );
        }

        return (
          <FileUI key={item.id} value={item.id} method={item.metadata.method}>
            <button
              onClick={() => {
                setId(item.id);
                setUrl(item.metadata.url);
                setMethod(item.metadata.method);
                setBody(item.metadata.body ?? '');
                setResponseBody('');
              }}
            >
              {item.name}
            </button>
          </FileUI>
        );
      })}
    </>
  );
}

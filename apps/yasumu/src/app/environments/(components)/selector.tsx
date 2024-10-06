'use client';
import { FsActionDialog } from '@/app/api-testing/(components)/files/fs-action-dialog';
import { cn } from '@/lib/utils';
import { FilePlus2, Trash } from 'lucide-react';
import { useCallback } from 'react';
import EnvironmentEditor from './editor';
import { useEnvironment } from '@/stores/environment/environment.store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useEnvironmentLoader } from '@/hooks/use-environment-loader';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';

export default function EnvironmentSelector() {
  const { addEnvironment, deleteEnvironment, environments, focused, setFocused } = useEnvironment();
  const { reloadEnv } = useEnvironmentLoader();

  const handleCreateFile = useCallback(
    async (name: string, description: string) => {
      try {
        const workspace = Yasumu.workspace;
        if (!workspace) return;
        const env = {
          id: crypto.randomUUID(),
          name,
          description,
          variables: [],
        };

        addEnvironment(env);

        await workspace.environments.setEnvironments([...environments, env]);
        await reloadEnv();
      } catch (e) {
        console.log(e);
        toast.error('Failed to create the environment.', {
          description: String(e),
        });
      }
    },
    [environments],
  );

  const handleDeleteFile = useCallback(async () => {
    try {
      const workspace = Yasumu.workspace;
      if (!workspace || !focused) return;
      setFocused(null);
      await workspace.environments.setEnvironments(environments.filter((env) => env.id !== focused.id));
      deleteEnvironment(focused.id);
      await reloadEnv();
    } catch (e) {
      console.log(e);
      toast.error('Failed to delete the environment.', {
        description: String(e),
      });
    }
  }, [focused, environments]);

  return (
    <div className="flex items-start gap-8">
      <div className="min-w-64 px-4 border-r">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Environments</h3>
          <div className="flex">
            {focused && (
              <AlertDialog>
                <AlertDialogTrigger asChild className="w-fit hover:bg-muted-foreground/30 p-1 cursor-pointer">
                  <Trash className="h-6 w-6" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the {focused?.name} environment and all
                      of its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleDeleteFile();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <FsActionDialog
              type="Environment"
              onCreate={handleCreateFile}
              description="Create a new environment."
              allowDescription
            >
              <FilePlus2 className="h-6 w-6" />
            </FsActionDialog>
          </div>
        </div>
        <div
          className="text-sm flex flex-col gap-1 mt-2 min-h-[80vh]"
          onClick={(e) => {
            e.stopPropagation();
            setFocused(null);
          }}
        >
          {environments.map((env) => (
            <button
              key={env.id}
              className={cn('text-left hover:bg-primary/30 p-1 rounded-sm font-medium', {
                'bg-primary/10': focused?.id === env.id,
              })}
              onClick={(e) => {
                e.stopPropagation();
                setFocused(env);
              }}
            >
              {env.name}
            </button>
          ))}
        </div>
      </div>
      <EnvironmentEditor total={environments.length} />
    </div>
  );
}

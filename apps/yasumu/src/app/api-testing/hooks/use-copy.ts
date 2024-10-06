import { TreeViewElement } from '@/components/magicui/file-tree';
import { useRequestFs } from '@/stores/api-testing/request-config.store';
import { useCallback } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { toast } from 'sonner';

export function useCopyCutPaste(item: TreeViewElement) {
  const { setCopied, copied, setCut, cut, selectedPath } = useRequestFs();

  const handleCopy = () => {
    setCopied(item.id);
    setCut(null);
  };

  const handleCut = () => {
    setCut(item.id);
    setCopied(null);
  };

  const handlePaste = useCallback(async () => {
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
  }, [copied, cut, item.id, setCut]);

  return { handleCopy, handleCut, handlePaste };
}

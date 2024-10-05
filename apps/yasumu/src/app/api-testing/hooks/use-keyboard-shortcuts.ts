import { useEffect } from 'react';

interface KeyboardShortcuts {
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
}

export const useKeyboardShortcuts = ({ onCopy, onCut, onPaste }: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'x':
            console.log('cut');
            onCut();
            break;
          case 'c':
            console.log('copy');
            onCopy();
            break;
          case 'v':
            console.log('paste');
            onPaste();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCopy, onCut, onPaste]);
};

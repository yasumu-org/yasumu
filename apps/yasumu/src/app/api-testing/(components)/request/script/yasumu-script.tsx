'use client';
import { javascript } from '@codemirror/lang-javascript';
import { Extension, useCodeMirror } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

export function YasumuRequestScript({ script, setScript }: { script: string; setScript: (script: string) => void }) {
  const { theme } = useTheme();
  const editor = useRef<HTMLDivElement>(null);

  const extensions: Extension[] = useMemo(() => [javascript()], []);

  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: script ?? '',
    onChange(value) {
      setScript(value.trim());
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    editable: true,
    extensions,
    lang: 'javascript',
    basicSetup: {
      foldGutter: true,
      highlightSpecialChars: true,
      tabSize: 2,
      lineNumbers: true,
      allowMultipleSelections: true,
      autocompletion: true,
      closeBrackets: true,
      syntaxHighlighting: true,
    },
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return <div className="h-full mt-4 border" ref={editor} />;
}

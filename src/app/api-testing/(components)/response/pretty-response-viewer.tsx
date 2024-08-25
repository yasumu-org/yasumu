'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useCodeMirror, type Extension } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { useMounted } from '@/hooks/use-mounted';
import { usePrettier } from '@/hooks/use-prettier';
import { cn } from '@/lib/utils';

export default function PrettyResponseViewer({ content }: { content: string }) {
  const { theme } = useTheme();
  const isMounted = useMounted();
  const editor = useRef<HTMLDivElement>(null);
  const { code, parser } = usePrettier(content, 'application/json');
  const extensions: Extension[] = useMemo(() => [javascript(), html(), xml(), json()], []);

  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: code,
    theme: theme === 'dark' ? 'dark' : 'light',
    editable: false,
    extensions,
    lang: parser.type,
    basicSetup: {
      foldGutter: true,
      highlightSpecialChars: true,
      tabSize: 2,
      lineNumbers: true,
    },
    className: cn(!isMounted && 'hidden', 'h-full'),
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  if (!isMounted) return null;

  return <div ref={editor} />;
}

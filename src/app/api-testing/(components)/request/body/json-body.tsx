'use client';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { json } from '@codemirror/lang-json';
import { Extension, useCodeMirror } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

export function JsonBody() {
  const { theme } = useTheme();
  const { body, setBody } = useRequestConfig();
  const editor = useRef<HTMLDivElement>(null);

  const extensions: Extension[] = useMemo(() => [json()], []);

  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: body.json || '',
    onChange(value) {
      setBody({ json: value });
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    editable: true,
    extensions,
    lang: 'json',
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

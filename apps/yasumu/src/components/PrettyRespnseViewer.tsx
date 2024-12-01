import { json } from '@codemirror/lang-json';
import { usePrettier } from '@/hooks/usePrettier';
import { useTextEditor } from '@/hooks/useTextEditor';
import React, { useRef } from 'react';

export function PrettyResponseViewer({ content }: { content: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { code, parser } = usePrettier(content, 'application/json');

  useTextEditor(editorRef, {
    code,
    setCode(code) {
      void code;
    },
    language: parser.type,
    editable: false,
    readOnly: true,
    extensions: [json()],
    basicSetup: {
      foldGutter: true,
      highlightSpecialChars: true,
      tabSize: 2,
      lineNumbers: true,
    },
    className: 'overflow-auto h-full w-full',
  });
  return <div ref={editorRef} />;
}

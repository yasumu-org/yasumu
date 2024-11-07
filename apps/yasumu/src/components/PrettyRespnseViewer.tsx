import { json } from '@codemirror/lang-json';
import { usePrettier } from '@/hooks/use-prettier';
import { useTextEditor } from '@/hooks/use-text-editor';
import React, { useRef } from 'react';

export function PrettyRespnseViewer({ content }: { content: string }) {
  console.log({ content });
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
  });
  return <div ref={editorRef} />;
}

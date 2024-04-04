import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import prettier from 'prettier/standalone';
import babel from 'prettier/plugins/babel';
import html from 'prettier/plugins/html';

export function Output({ value }: { value: string }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    (async () => {
      const formatted = await prettier
        .format(value, {
          parser: 'babel',
          tabWidth: 2,
          plugins: [html, babel],
        })
        .catch((w) => {
          console.log(w);
          return value;
        });

      setCode(formatted);
    })();
  }, [value]);

  return (
    <Editor
      height="300px"
      theme="dark"
      value={code}
      language="html"
      className="border rounded-sm"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        formatOnPaste: true,
        formatOnType: true,
        fontLigatures: true,
        autoIndent: 'full',
      }}
    />
  );
}

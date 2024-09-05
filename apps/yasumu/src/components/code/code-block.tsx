'use client';

import React, { useEffect } from 'react';
import { highlight, HighlightedCode, Pre } from 'codehike/code';
import { CopyToClipboard } from './copy-to-clipboard';

type ThemeType = Parameters<typeof highlight>[1];

export function CodeBlock({
  children,
  language,
  meta,
  theme,
}: React.PropsWithChildren<{
  language: string;
  meta?: string;
  theme?: ThemeType;
}>) {
  const [code, setCode] = React.useState<HighlightedCode | null>(null);

  const codeValue = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    highlight(
      {
        lang: language,
        meta: meta || 'file',
        value: codeValue,
      },
      theme || 'github-dark',
    ).then(setCode, Object);
  }, [codeValue, language, meta, theme]);

  return (
    <CopyToClipboard value={codeValue}>
      {code ? (
        <Pre code={code} className="bg-muted text-sm p-4 rounded-lg" />
      ) : (
        <pre className="bg-muted text-sm p-4 rounded-lg">{children}</pre>
      )}
    </CopyToClipboard>
  );
}

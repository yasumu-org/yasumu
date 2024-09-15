'use client';
import { IS_AUDIO, IS_BINARY_DATA, IS_IMAGE, IS_VIDEO } from '@/lib/utils';
import { useResponse } from '@/stores/api-testing/response.store';
import React from 'react';

export function ResponseAttachmentGuard({
  contentType,
  children,
}: React.PropsWithChildren<{
  contentType: string | null;
}>) {
  const { url } = useResponse();
  if (!contentType) return <>{children}</>;

  if (IS_AUDIO(contentType)) return <audio src={url} controls onError={console.log} />;
  if (IS_IMAGE(contentType))
    return (
      <img
        src={url}
        alt={url}
        crossOrigin="anonymous"
        className="aspect-square max-h-52 max-w-52 h-auto w-auto"
        onError={console.log}
      />
    );
  if (IS_VIDEO(contentType))
    return <video src={url} controls className="aspect-video max-h-80 max-w-96" onError={console.log} />;
  if (IS_BINARY_DATA(contentType)) return <h1>Binary Data</h1>;

  return <>{children}</>;
}

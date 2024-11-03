import React from 'react';

export function OutputLayout({
  children,
  statusbar,
}: React.PropsWithChildren<{
  statusbar?: React.ReactNode;
}>) {
  return (
    <div className="p-2 space-y-2 flex flex-col">
      {statusbar}
      {children}
    </div>
  );
}

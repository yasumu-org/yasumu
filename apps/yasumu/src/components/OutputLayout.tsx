import React from 'react';

export function OutputLayout({
  children,
  statusbar,
}: React.PropsWithChildren<{
  statusbar?: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      {statusbar}
      {children}
    </div>
  );
}

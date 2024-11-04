'use client';

import { Yasumu } from '@/lib/yasumu';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function WorkspaceProvider({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Yasumu.openWorkspace({
      path: '/dev/null',
    }).then(
      () => {
        setLoading(false);
      },
      (e) => {
        alert(String(e));
        setLoading(false);
      },
    );
  }, []);

  if (loading) {
    return (
      <div className="h-screen grid place-items-center">
        <LoaderCircle className="size-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

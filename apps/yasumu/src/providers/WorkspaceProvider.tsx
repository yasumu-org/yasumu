'use client';

import { Yasumu } from '@yasumu/core';
import { initYasumu } from '@/lib/yasumu';
import { LoaderCircle } from 'lucide-react';
import React, { createContext, useEffect, useState } from 'react';

const YasumuContext = createContext<Yasumu | null>(null);

export function useYasumu() {
  const ctx = React.useContext(YasumuContext);

  if (!ctx) throw new Error('useYasumu must be used within a YasumuProvider');

  return ctx;
}

export default function WorkspaceProvider({ children }: React.PropsWithChildren) {
  const [yasumu, setYasumu] = useState<Yasumu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const yasumu = initYasumu();

    setYasumu(yasumu);
    yasumu
      .openWorkspace({
        path: '/dev/null',
      })
      .then(
        () => {
          setLoading(false);
        },
        (e) => {
          alert(String(e));
          setLoading(false);
        },
      );
  }, []);

  return (
    <YasumuContext.Provider value={yasumu}>
      {loading ? (
        <div className="h-screen grid place-items-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : (
        children
      )}
    </YasumuContext.Provider>
  );
}

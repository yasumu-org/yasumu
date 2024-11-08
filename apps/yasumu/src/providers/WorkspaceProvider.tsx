'use client';

import { Yasumu } from '@yasumu/core';
import { initYasumu } from '@/lib/yasumu';
import { LoaderCircle } from 'lucide-react';
import React, { createContext, useEffect, useState } from 'react';
import { NoWorkspaceScreen } from '@/components/NoWorkspace';
import { isNative } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { YasumuSocials } from '@/lib/constants/socials';
import { Button } from '@/components/ui/button';

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
    const webWarning = localStorage.getItem('web-warning-dismissed');

    if (!isNative() && !webWarning) {
      const toastInfo = toast.info('You are using the web version of Yasumu.', {
        duration: 10000,
        dismissible: true,
        className: 'select-none',
        onDismiss() {
          localStorage.setItem('web-warning-dismissed', 'true');
        },
        description: (
          <div className="space-y-2">
            <p>
              The web version may not have all the features of the native version. Please use the native version for the
              best experience.
            </p>
            <div className="flex gap-4">
              <Link href={YasumuSocials.Download} target="_blank">
                <Button size="sm">Download</Button>
              </Link>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  localStorage.setItem('web-warning-dismissed', 'true');
                  toast.dismiss(toastInfo);
                }}
              >
                Don{"'"}t show again
              </Button>
            </div>
          </div>
        ),
      });
    }
  }, []);

  useEffect(() => {
    initYasumu()
      .then((yasumu) => {
        setYasumu(yasumu);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <YasumuContext.Provider value={yasumu}>
      {loading ? (
        <div className="h-full grid place-items-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : !yasumu?.workspace ? (
        <NoWorkspaceScreen />
      ) : (
        children
      )}
    </YasumuContext.Provider>
  );
}

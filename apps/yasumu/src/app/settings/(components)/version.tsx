'use client';
import { LoadingSpinner } from '@/components/layout/loading';
import { Yasumu } from '@/lib/yasumu';
import { useEffect, useState } from 'react';

interface IMetadata {
  name: string;
  version: string;
  tauriVersion: string;
}

export function YasumuVersion() {
  const [metadata, setMetadata] = useState<IMetadata | null>(null);

  useEffect(() => {
    (async () => {
      const name = await Yasumu.app.getName().catch(() => 'Unknown');
      const version = await Yasumu.app.getVersion().catch(() => '0.0.0');
      const tauriVersion = await Yasumu.app.getRuntimeVersion().catch(() => '0.0.0');

      setMetadata({
        name,
        version,
        tauriVersion,
      });
    })();
  }, []);

  return (
    <div className="px-4">
      <h4 className="font-bold text-sm">About</h4>
      {metadata && (
        <ul className="text-xs font-mono">
          <li>
            <strong>- App Name:</strong> {metadata.name}
          </li>
          <li>
            <strong>- App Version:</strong> {metadata.version}
          </li>
          <li>
            <strong>- Tauri Version:</strong> {metadata.tauriVersion}
          </li>
        </ul>
      )}
      {!metadata && (
        <p>
          <LoadingSpinner className="h-auto" />
        </p>
      )}
    </div>
  );
}

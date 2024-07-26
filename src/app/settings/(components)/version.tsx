'use client';
import { LoadingSpinner } from '@/components/layout/loading';
import { getName, getVersion, getTauriVersion } from '@tauri-apps/api/app';
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
      const name = await getName().catch(() => 'Unknown');
      const version = await getVersion().catch(() => '0.0.0');
      const tauriVersion = await getTauriVersion().catch(() => '0.0.0');

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

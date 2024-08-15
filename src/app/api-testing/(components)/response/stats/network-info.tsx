import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { Globe, GlobeLock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Commands } from '@yasumu/core';
import { Separator } from '@/components/ui/separator';

const dummyStats = {
  localAddress: '192.168.1.1',
  remoteAddress: '192.168.101.4',
  tlsProtocol: 'TLSv1.3',
  cipherName: 'TLS_AES_128_GCM_SHA256',
  certificateCN: '*.example.com',
  issuerCN: 'Cloudflare Inc ECC CA-3',
  validUntil: 'Dec 30, 2025 23:59:59 GMT',
  secure: true,
};

// export function NetworkInfo() {
//   const {
//     certificateCN,
//     cipherName,
//     issuerCN,
//     localAddress,
//     remoteAddress,
//     secure,
//     tlsProtocol,
//     validUntil,
//   } = dummyStats;
//   return (
//     <HoverCard openDelay={100} closeDelay={100}>
//       <HoverCardTrigger>
//         {secure ? (
//           <GlobeLock className="h-4 w-4 cursor-pointer" />
//         ) : (
//           <Globe className="h-4 w-4 cursor-pointer text-orange-500" />
//         )}
//       </HoverCardTrigger>
//       <HoverCardContent className="w-fit">
//         <h1 className="font-bold text-sm">Network Information</h1>
//         <Separator orientation="horizontal" />
//         <div className="flex flex-col gap-2 mt-2 text-xs">
//           <Info title="Local Address" value={localAddress} />
//           <Info title="Remote Address" value={remoteAddress} />
//           <Separator orientation="horizontal" />
//           <Info title="TLS Protocol" value={tlsProtocol} />
//           <Info title="Cipher Name" value={cipherName} />
//           <Separator orientation="horizontal" />
//           <Info title="Certificate CN" value={certificateCN} />
//           <Info title="Issuer CN" value={issuerCN} />
//           <Info title="Valid Until" value={validUntil} />
//         </div>
//       </HoverCardContent>
//     </HoverCard>
//   );
// }

export function NetworkInfo() {
  const [localIp, setLocalIp] = useState<string>('N/A');
  const { url } = useRequestConfig();
  const isSecure = useMemo(() => url.startsWith('https://'), [url]);

  useEffect(() => {
    invoke(Commands.GetLocalAddress).then((res) => {
      setLocalIp(res as string);
    }, Object);
  }, []);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        {isSecure ? (
          <GlobeLock className="h-4 w-4 cursor-pointer" />
        ) : (
          <Globe className="h-4 w-4 cursor-pointer text-orange-500" />
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <h1 className="font-bold text-sm">Network Information</h1>
        <Separator orientation="horizontal" />
        <div className="flex flex-col gap-2 mt-2 text-xs">
          <Info title="Secure?" value={isSecure ? 'Yes' : 'No'} />
          <Info title="Local Address" value={localIp} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="font-semibold text-start">{title}</span>
      <span className="text-muted-foreground text-end">{value}</span>
    </div>
  );
}

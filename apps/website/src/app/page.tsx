import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DownloadIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-[#272a37] h-screen grid place-items-center">
      <div className="flex items-center flex-col">
        <div className="flex items-center">
          <Image src="/logo-dark.svg" alt="Logo" width={150} height={150} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-6xl text-[#8563ff]">Yasumu</h1>
              <Badge variant="outline" className="bg-yellow-600 uppercase">
                Preview
              </Badge>
            </div>
            <p className="font-medium">
              Simplified API testing platform for humans.
            </p>
          </div>
        </div>
        <div className="space-x-4">
          <Link href="https://github.com/yasumu-org/yasumu">
            <Button
              className="bg-[#8563ff] hover:bg-[#6647d8] text-white gap-2 items-center"
              size="lg"
            >
              <GitHubLogoIcon />
              GitHub
            </Button>
          </Link>
          <Link href="https://github.com/yasumu-org/yasumu/releases/latest">
            <Button
              className="bg-[#aecbfa] hover:bg-[#799eda] text-[#272a37] gap-2 items-center"
              size="lg"
            >
              <DownloadIcon />
              Download
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

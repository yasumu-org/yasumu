'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getHeaderDetails } from '@/lib/header-info';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

interface IHeader {
  key: string;
  value: string;
}

export function ResponseHeaders({ headers }: { headers: IHeader[] }) {
  return (
    <>
      <div className="overflow-y-auto border-y">
        <Table className="border-x">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((header, index) => {
              return (
                <TableRow key={`${header.key}-${index}`}>
                  <TableCell className="font-medium">
                    <HeaderKey name={header.key} />
                  </TableCell>
                  <TableCell className="font-medium">{header.value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function HeaderKey({ name }: { name: string }) {
  const details = useMemo(() => {
    if (!name) return;
    return getHeaderDetails(name);
  }, [name]);

  return (
    <div className="flex items-center gap-2">
      <h1>{name}</h1>
      {details && (
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </HoverCardTrigger>
          <HoverCardContent className="w-[400px]">
            <h1 className="font-bold text-sm">{details.name}</h1>
            <Separator orientation="horizontal" />
            <p>{details.description}</p>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}

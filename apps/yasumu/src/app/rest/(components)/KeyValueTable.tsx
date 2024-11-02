import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import React from 'react';

export default function KeyValueTable() {
  return (
    <div>
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          <TableRow className="border">
            <TableCell>
              <Input placeholder="Name" />
            </TableCell>
            <TableCell>
              <Input placeholder="Value" />
            </TableCell>
            <TableCell className="space-x-2">
              <Checkbox className="h-5 w-5" />
              <Button size="icon" variant="destructive">
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

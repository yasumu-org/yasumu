import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';

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
              <Input placeholder="Name" className="h-8" />
            </TableCell>
            <TableCell>
              <Input placeholder="Value" className="h-8" />
            </TableCell>
            <TableCell className="flex gap-2 items-center">
              <Checkbox className="size-4" />
              <button className="hover:bg-secondary p-2">
                <Trash className="size-[18px] text-red-500" />
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

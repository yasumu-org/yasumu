/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';

export default function KeyValueTable({
  value,
  onChange,
}: {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}) {
  const vals = Object.entries(value);

  if (!vals.length) {
    vals.push(['', '']);
  }

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
          {vals.map(([key, val], i) => (
            <TableRow className="border" key={i}>
              <TableCell>
                <Input
                  placeholder="Name"
                  className="h-8"
                  value={key}
                  onChange={(e) => {
                    const newVals = [...vals];
                    newVals[i] = [e.target.value, val];
                    onChange(Object.fromEntries(newVals));
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Value"
                  className="h-8"
                  value={val}
                  onChange={(e) => {
                    const newVals = [...vals];
                    newVals[i] = [key, e.target.value];
                    onChange(Object.fromEntries(newVals));
                  }}
                />
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <Checkbox className="size-4" />
                <button
                  className="hover:bg-secondary p-2"
                  onClick={() => {
                    const newVals = [...vals];
                    newVals.splice(i, 1);
                    onChange(Object.fromEntries(newVals));
                  }}
                >
                  <Trash className="size-[18px] text-red-500" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function ParameterTable({ name }: { name: string }) {
  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>{name}</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Input type="text" placeholder="Name" />
          </TableCell>
          <TableCell>
            <Input type="text" placeholder="Value" />
          </TableCell>
          <TableCell className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <Button variant="ghost" size="icon">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

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
import { useRequestStore } from '@/store/requestStore';

export function MutableKVTable() {
  const { headers, setHeaders } = useRequestStore();

  return (
    <div className="space-y-2">
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map((key, value) => (
            <TableRow>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Name"
                  value={key}
                  onChange={(e) => {
                    const updated = headers.set(e.target.value, '');
                    setHeaders(updated);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => {
                    const updated = headers.set(key, e.target.value);
                    setHeaders(updated);
                  }}
                />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    headers.delete(key);
                    setHeaders(headers);
                  }}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() => {
          const size = headers.size + 1;
          const key = `param${size}`;
          const value = `value${size}`;
          const param = headers.set(key, value);
          setHeaders(param);
        }}
        size="sm"
      >
        Add new
      </Button>
    </div>
  );
}

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
import { useRequestContext } from '@/context/RequestContext';

export function ParameterTable() {
  const { parameters, setParameters } = useRequestContext();

  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from(parameters.entries()).map(([key, value]) => (
          <TableRow>
            <TableCell>
              <Input
                type="text"
                placeholder="Name"
                value={key}
                onChange={(e) => {
                  parameters.delete(key);
                  setParameters(e.target.value, '');
                }}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                placeholder="Value"
                value={value}
                onChange={(e) => {
                  setParameters(key, e.target.value);
                }}
              />
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Checkbox defaultChecked />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  parameters.delete(key);
                  setParameters('', '');
                }}
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

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
import { useEffect } from 'react';

export function ParameterTable() {
  const { parameters, setParameters } = useRequestStore();

  useEffect(() => {
    console.log('parameters changed', parameters);
  }, [parameters]);

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
          {parameters.map((key, value) => (
            <TableRow>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Name"
                  value={key}
                  onChange={(e) => {
                    const updated = parameters.set(e.target.value, '');
                    setParameters(updated);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => {
                    const updated = parameters.set(key, e.target.value);
                    setParameters(updated);
                  }}
                />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    parameters.delete(key, value);
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
          const size = parameters.size + 1;
          const key = `param${size}`;
          const value = `value${size}`;
          const param = parameters.set(key, value);
          setParameters(param);
        }}
        size="sm"
      >
        Add new parameter
      </Button>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash } from 'lucide-react';
import { useCallback, useState } from 'react';

interface IHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export function RequestHeaders() {
  const [headers, setHeaders] = useState<IHeader[]>([
    { key: '', value: '', enabled: true },
  ]);

  const onEdit = useCallback(
    (index: number, key: string, value: string, enabled: boolean) => {
      const newHeaders = [...headers];
      newHeaders[index] = { ...newHeaders[index], key, value, enabled };
      setHeaders(newHeaders);
    },
    [headers]
  );

  const onDelete = useCallback(
    (index: number) => {
      const newHeaders = [...headers];
      newHeaders.splice(index, 1);
      setHeaders(newHeaders);
    },
    [headers]
  );

  const onAdd = useCallback(() => {
    setHeaders((prev) => [...prev, { key: '', value: '', enabled: true }]);
  }, []);

  return (
    <>
      <div className="overflow-y-auto max-h-[30vh] border-y">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((parameter, index) => {
              return (
                <RequestHeader
                  key={`${parameter.key}-${index}`}
                  data={parameter}
                  onDelete={() => {
                    onDelete(index);
                  }}
                  onEdit={(key, value, enabled) => {
                    onEdit(index, key, value, enabled);
                  }}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button className="mt-2" onClick={onAdd}>
        Add Header
      </Button>
    </>
  );
}

interface IRequestHeaderProps {
  data: IHeader;
  onEdit: (key: string, value: string, enabled: boolean) => void;
  onDelete: () => void;
}

function RequestHeader({ data, onDelete, onEdit }: IRequestHeaderProps) {
  return (
    <TableRow>
      <RequestHeaderInput
        value={data.key}
        placeholder="Name"
        onChange={(key) => {
          onEdit(key, data.value, data.enabled);
        }}
      />
      <RequestHeaderInput
        value={data.value}
        placeholder="Value"
        onChange={(value) => {
          onEdit(data.key, value, data.enabled);
        }}
      />
      <TableCell className="flex items-center gap-2">
        <Switch
          checked={data.enabled}
          onCheckedChange={(checked) => {
            onEdit(data.key, data.value, checked);
          }}
        />
        <Button
          variant="ghost"
          size={'sm'}
          className="hover:bg-destructive"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function RequestHeaderInput({
  onChange,
  value,
  placeholder,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <TableCell className="font-medium">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </TableCell>
  );
}

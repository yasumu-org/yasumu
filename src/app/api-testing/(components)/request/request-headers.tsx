'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { useLayoutStore } from '@/stores/application/layout.store';
import { Trash } from 'lucide-react';
import { useCallback, useState } from 'react';

interface IHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export function RequestHeaders() {
  const { isVertical } = useLayoutStore();
  const { setHeaders, headers } = useRequestConfig();

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
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  }, []);

  return (
    <>
      <div
        className={cn(
          'overflow-y-auto border-y',
          isVertical() ? 'max-h-[30vh]' : 'max-h-[75vh]'
        )}
      >
        <Table className="border-x">
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
      <Button className="mt-2" onClick={onAdd} size="sm">
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
        <Checkbox
          checked={data.enabled}
          onCheckedChange={(checked) => {
            onEdit(data.key, data.value, !!checked);
          }}
        />
        <Button
          variant="ghost"
          size={'sm'}
          className="hover:bg-destructive hover:text-destructive-foreground"
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

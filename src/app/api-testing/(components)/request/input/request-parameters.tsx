'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { useLayoutStore } from '@/stores/application/layout.store';
import { Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface IParameter {
  key: string;
  value: string;
  enabled: boolean;
}

export function RequestParameters() {
  const { isVertical } = useLayoutStore();
  const { url, setUrl } = useRequestConfig();
  const [parameters, setParameters] = useState<IParameter[]>(() => {
    try {
      const urlObject = new URL(url);
      const searchParams = urlObject.searchParams;
      const params = Array.from(searchParams.entries()).map(([key, value]) => {
        return { key, value: value || '', enabled: true };
      });
      return params;
    } catch {
      return [{ key: '', value: '', enabled: true }];
    }
  });

  const onEdit = useCallback(
    (index: number, key: string, value: string, enabled: boolean) => {
      const newParameters = [...parameters];
      newParameters[index] = { ...newParameters[index], key, value, enabled };
      setParameters(newParameters);
    },
    [parameters],
  );

  const onDelete = useCallback(
    (index: number) => {
      const newParameters = [...parameters];
      newParameters.splice(index, 1);
      setParameters(newParameters);
    },
    [parameters],
  );

  const onAdd = useCallback(() => {
    setParameters((prev) => [...prev, { key: '', value: '', enabled: true }]);
  }, []);

  useEffect(() => {
    try {
      if (!url) return setParameters([]);
      const _url = new URL(url);
      const params = Array.from(_url.searchParams.entries()).map(([k, v]) => ({
        key: k,
        value: v || '',
        enabled: true,
      }));

      setParameters(params);
    } catch {}
  }, [url]);

  return (
    <>
      <div className={cn('overflow-y-auto border-y', isVertical() ? 'max-h-[30vh]' : 'max-h-[75vh]')}>
        <Table className="border-x">
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((parameter, index) => {
              return (
                <RequestParameter
                  key={index}
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
        Add Parameter
      </Button>
    </>
  );
}

interface IRequestParameterProps {
  data: IParameter;
  onEdit: (key: string, value: string, enabled: boolean) => void;
  onDelete: () => void;
}

function RequestParameter({ data, onDelete, onEdit }: IRequestParameterProps) {
  return (
    <TableRow>
      <RequestParameterInput
        value={data.key}
        placeholder="Key"
        onChange={(key) => {
          onEdit(key, data.value, data.enabled);
        }}
      />
      <RequestParameterInput
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

function RequestParameterInput({
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

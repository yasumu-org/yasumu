'use client';

import React, { useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CirclePlus, File, Trash } from 'lucide-react';

interface EnvVar {
  id: string;
  key: string;
  value: string;
}

export function EnvVarsTable() {
  const [envVars, setEnvVars] = useState<Array<EnvVar>>([{ id: '1', key: '', value: '' }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addAnother() {
    setEnvVars((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        key: '',
        value: '',
      },
    ]);
  }

  function parseEnvContent(content: string) {
    const envVars = content
      .split('\n')
      .map((c): null | EnvVar => {
        const [key, value] = c.split('=');
        if (!key || !value) return null;

        return { id: Math.random().toString() + Date.now(), key, value };
      })
      .filter(Boolean) as Array<EnvVar>;

    setEnvVars((prev) => [...prev, ...envVars]);
  }

  function parseEnvFile(file: File) {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      parseEnvContent(content);
    });

    reader.readAsText(file);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    parseEnvFile(file);
  }

  function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (!file) return;

    parseEnvFile(file);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTableElement>) {
    event.preventDefault();

    const data = event.clipboardData.getData('text');
    parseEnvContent(data);
  }

  return (
    <>
      <Table onDragOver={(event) => event.preventDefault()} onDrop={handleFileDrop} onPaste={handlePaste}>
        <TableHeader className="border">
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          {envVars.map((envVar) => {
            return (
              <TableRow key={envVar.id} className="border">
                <TableCell>
                  <Input defaultValue={envVar.key} placeholder="e.g. CLIENT_KEY" className="py-3" />
                </TableCell>
                <TableCell>
                  <Input defaultValue={envVar.value} className="py-3" />
                </TableCell>
                <TableCell>
                  <button className="hover:bg-secondary p-2">
                    <Trash className="size-[18px] text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex gap-4 mt-7">
        <Button onClick={addAnother} variant="secondary" className="flex items-center">
          <CirclePlus />
          <span>Add Another</span>
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="ghost" className="flex items-center">
          <File /> <span>Import .env</span>
        </Button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
      </div>
    </>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

interface DialogProps {
  children: React.ReactNode;
  value: string;
  onCreate: (name: string) => void;
}

export function CreateEnvDialog({ children, value, onCreate }: DialogProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Environment</DialogTitle>
          <DialogDescription>Create a new environment</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              ref={nameRef}
              defaultValue={value}
              id="name"
              type="text"
              className="col-span-3"
              autoComplete="off"
              aria-autocomplete="none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              const val = nameRef.current?.value ?? '';
              if (!val) return;
              setOpen(false);
              onCreate(val);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

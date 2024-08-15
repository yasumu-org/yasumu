'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

interface FsActionDialogProps {
  type: string;
  description: string;
  onCreate: (name: string) => void;
}

export function FsActionDialog({
  type,
  description,
  children,
  onCreate,
}: React.PropsWithChildren<FsActionDialogProps>) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-fit hover:bg-muted-foreground/30 p-1 cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create {type}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              ref={nameRef}
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
            type="submit"
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

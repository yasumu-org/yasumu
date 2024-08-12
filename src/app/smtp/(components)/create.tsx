'use client';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Argument } from './argument';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function CreateSmtp({ port, setPort }: { port: string; setPort: (port: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    const portNum = Number(port);

    if (open && isNaN(portNum)) {
      return toast.error('Port must be a number.');
    }

    setOpen((p) => !p);

    if (open) {
      toast.success('Configuration saved.');
    }
  }, [port, open]);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Settings className="h-5 w-5 mr-2" />
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create SMTP Server</DialogTitle>
          <DialogDescription>Create a new SMTP server on your local machine.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Argument value={port} onChange={setPort} name="Port" description="Port number to run the SMTP server on." />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleOpen}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

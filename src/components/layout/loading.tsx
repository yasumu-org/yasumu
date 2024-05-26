import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="h-[90vh] overflow-hidden grid place-items-center select-none">
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
    </div>
  );
}

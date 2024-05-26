import { NetworkInfo } from './network-info';
import { ResponseSize } from './response-size';
import { ResponseStatus } from './response-status';
import { ResponseTime } from './response-time';

export function ResponseStats() {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold">
      <NetworkInfo />
      <ResponseStatus statusCode={200} />
      <ResponseTime />
      <ResponseSize />
    </div>
  );
}

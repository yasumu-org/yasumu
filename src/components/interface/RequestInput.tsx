import { cn } from '@/lib/utils';
import { httpMethodStyles, RequestMethod } from '../tables/RequestMethod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  HttpMethod,
  useExecuteRequest,
  useRequestStore,
} from '@/store/requestStore';

export function RequestInput() {
  const { url, setURL, method, setMethod, parameters } = useRequestStore();
  const execute = useExecuteRequest();

  return (
    <div className="flex gap-2">
      <div className="flex w-full">
        <Select
          value={method}
          onValueChange={(m) => setMethod(m as HttpMethod)}
        >
          <SelectTrigger
            className={cn(
              'w-[150px] rounded-r-none border-r-0',
              httpMethodStyles[method]
            )}
          >
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(HttpMethod).map((method) => (
              <SelectItem key={method} value={method}>
                <RequestMethod method={method} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={`${url}${parameters.size ? '?' : ''}${parameters.toString()}`}
          onChange={(e) => setURL(e.target.value)}
          placeholder="URL"
          className="rounded-l-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              execute();
            }
          }}
        />
      </div>
      <Button className="w-1/6" onClick={execute}>
        Send
      </Button>
    </div>
  );
}

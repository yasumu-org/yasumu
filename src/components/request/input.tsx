import { cn } from '@/lib/utils';
import {
  httpMethodStyles,
  RequestMethod,
} from '../text-formats/request-method';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Additionals } from './additionals';
import {
  HttpMethod,
  useExecuteRequest,
  useRequestStore,
} from '@/store/requestStore';

export function RequestInput() {
  const { url, setURL, method, setMethod, parameters } = useRequestStore();
  const execute = useExecuteRequest();

  return (
    <div>
      <div className="flex gap-2 border border-l-0 bg-muted p-2">
        <Select
          value={method}
          onValueChange={(m) => setMethod(m as HttpMethod)}
        >
          <SelectTrigger className={cn('w-[150px]', httpMethodStyles[method])}>
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
          className="w-[70%]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              execute();
            }
          }}
        />
        <Button onClick={execute}>Send</Button>
      </div>
      <Additionals />
    </div>
  );
}

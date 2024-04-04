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
import { RequestMethod, useRequestContext } from '@/context/RequestContext';

export function RequestInput() {
  const { url, setURL, method, setMethod, execute } = useRequestContext();

  return (
    <div>
      <div className="flex gap-2 border border-l-0 bg-muted p-2">
        <Select
          value={method}
          onValueChange={(m) => setMethod(m as RequestMethod)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(RequestMethod).map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={url}
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

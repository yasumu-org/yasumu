import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { invoke } from '@tauri-apps/api';
import { Additionals } from './additionals';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestMethod {
  type: HttpMethod;
  color: string;
}

const Methods = {
  GET: { type: 'GET', color: 'text-green-500' },
  POST: { type: 'POST', color: 'text-blue-500' },
  PUT: { type: 'PUT', color: 'text-yellow-500' },
  DELETE: { type: 'DELETE', color: 'text-red-500' },
  PATCH: { type: 'PATCH', color: 'text-purple-500' },
} as const;

export function RequestInput() {
  const [url, setURL] = useState('');
  const [method, setMethod] = useState<RequestMethod>(Methods.GET);

  const execute = async () => {
    await invoke('execute', { url, method: method.type });
  };

  return (
    <div>
      <div className="flex gap-2 border border-l-0 bg-muted p-2">
        <Select
          value={method.type}
          onValueChange={(m) => setMethod(Methods[m as HttpMethod])}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Method" className={method.color} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Methods).map((method) => (
              <SelectItem
                key={method.type}
                value={method.type}
                className={method.color}
              >
                {method.type}
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
        />
        <Button onClick={execute}>Send</Button>
      </div>
      <Additionals />
    </div>
  );
}

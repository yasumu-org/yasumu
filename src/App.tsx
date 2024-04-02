import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

const HTTP_METHODS: {
  name: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  color: string;
}[] = [
  { name: 'GET', color: 'text-green-500' },
  { name: 'POST', color: 'text-blue-500' },
  { name: 'PUT', color: 'text-yellow-500' },
  { name: 'DELETE', color: 'text-red-500' },
  { name: 'PATCH', color: 'text-purple-500' },
];

function App() {
  const [url, setURL] = useState('');
  const [method, setMethod] = useState('GET');
  const [output, setOutput] = useState('');

  useEffect(() => {
    toast('Welcome to Proton! 🚀', {
      description: 'Enjoy the application!',
      action: {
        label: 'Close',
        onClick: () => {
          console.log('Toast closed');
        },
      },
    });
  }, []);

  async function execute() {
    const nativeMsg: string = await invoke('execute', { url, method });
    setOutput(nativeMsg);
  }

  return (
    <div className="container">
      <h1>Proton</h1>
      <div className="flex gap-2 border bg-muted p-2 rounded-lg">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((method) => (
              <SelectItem
                key={method.name}
                value={method.name}
                className={method.color}
              >
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="URL"
        />
        <Button onClick={execute}>Send</Button>
      </div>
      <div className="pt-16">{output}</div>
    </div>
  );
}

export default App;

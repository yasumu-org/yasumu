import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const Methods = [
  { name: 'GET', color: 'text-green-500 hover:text-green-500' },
  { name: 'POST', color: 'text-blue-500 hover:text-blue-500' },
  { name: 'PUT', color: 'text-yellow-500 hover:text-yellow-500' },
  { name: 'DELETE', color: 'text-red-500 hover:text-red-500' },
  { name: 'PATCH', color: 'text-pink-500 hover:text-pink-500' },
  { name: 'OPTIONS', color: 'text-purple-500 hover:text-purple-500' },
  { name: 'HEAD', color: 'text-gray-500 hover:text-gray-500' },
];

export default function Home() {
  return (
    <main className="w-full p-4">
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {Methods.map((method, index) => (
              <SelectItem key={index} value={method.name} className={cn('font-medium', method.color)}>
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input placeholder="Enter a URL..." />
        <Button>Send</Button>
      </div>
    </main>
  );
}

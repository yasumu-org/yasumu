import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type RadioProps = React.ComponentProps<typeof RadioGroupItem>;

function Radio({ children, ...rest }: RadioProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <RadioGroupItem {...rest} />
      {children}
    </div>
  );
}

const types = [
  {
    name: 'None',
    value: 'none',
  },
  {
    name: 'Raw',
    value: 'raw',
  },
  {
    name: 'x-www-form-urlencoded',
    value: 'x-www-form-urlencoded',
  },
  {
    name: 'Binary',
    value: 'binary',
  },
];

const ContentType = {
  json: {
    name: 'JSON',
    value: 'json',
  },
  xml: {
    name: 'XML',
    value: 'xml',
  },
  html: {
    name: 'HTML',
    value: 'html',
  },
  text: {
    name: 'Text',
    value: 'text',
  },
  javascript: {
    name: 'JavaScript',
    value: 'javascript',
  },
} as const;

type ContentType = (typeof ContentType)[keyof typeof ContentType];

export function RequestBodyEditor() {
  const [bodyType, setBodyType] = useState(types[0]);
  const [contentType, setContentType] = useState<ContentType>(ContentType.json);

  return (
    <div>
      <RadioGroup
        value={bodyType.value}
        onValueChange={(v) => setBodyType(types.find((t) => t.value === v)!)}
        className="flex items-center gap-4 my-4"
      >
        {types.map((type) => (
          <Radio
            key={type.value}
            value={type.value}
            id={type.value}
            className="cursor-pointer"
          >
            <Label htmlFor={type.value} className="cursor-pointer">
              {type.name}
            </Label>
          </Radio>
        ))}
        {bodyType.value === 'raw' && (
          <Select
            value={contentType.value}
            onValueChange={(v) =>
              setContentType(ContentType[v as keyof typeof ContentType])
            }
          >
            <SelectTrigger className="border-none max-w-fit text-blue-500 font-medium">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ContentType).map((type) => (
                <SelectItem
                  value={type.value}
                  key={type.value}
                  className="text-blue-500 font-medium cursor-pointer"
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </RadioGroup>
      <Textarea>This is a body</Textarea>
    </div>
  );
}

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

type RadioProps = React.ComponentProps<typeof RadioGroupItem>;

function Radio({ children, ...rest }: RadioProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <RadioGroupItem {...rest} />
      {children}
    </div>
  );
}

const types = [
  {
    name: 'Text',
    value: 'text',
  },
  {
    name: 'JSON',
    value: 'json',
  },
  {
    name: 'Form Data',
    value: 'form-data',
  },
  {
    name: 'File',
    value: 'file',
  },
  {
    name: 'Binary',
    value: 'binary',
  },
];

export function Body() {
  const [bodyType, setBodyType] = useState('text');

  return (
    <div>
      <RadioGroup
        value={bodyType}
        onValueChange={setBodyType}
        className="flex items-center gap-8 my-4"
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
      </RadioGroup>
      <Textarea>This is a body</Textarea>
    </div>
  );
}

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { JsonBody } from './json-body';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/application/layout.store';

const BodyType = {
  None: 'none',
  JSON: 'json',
  FormData: 'formdata',
} as const;

type BodyType = (typeof BodyType)[keyof typeof BodyType];

export function RequestBody() {
  const { isVertical } = useLayoutStore();
  const [bodyType, setBodyType] = useState<BodyType>('none');

  return (
    <div
      className={cn(
        'overflow-y-auto',
        isVertical() ? 'max-h-[35vh]' : 'max-h-[75vh]'
      )}
    >
      <RadioGroup
        value={bodyType}
        orientation="horizontal"
        className="flex"
        onValueChange={(value) => {
          setBodyType(value as BodyType);
        }}
      >
        {Object.entries(BodyType).map(([key, value]) => {
          return (
            <div className="flex items-center space-x-2" key={value}>
              <RadioGroupItem value={value} id={value} />
              <Label className="cursor-pointer" htmlFor={value}>
                {key}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {bodyType === BodyType.JSON && <JsonBody />}
      {bodyType === BodyType.FormData && <div>FormData</div>}
    </div>
  );
}

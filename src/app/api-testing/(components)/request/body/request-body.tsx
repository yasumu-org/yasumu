import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { JsonBody } from './json-body';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/application/layout.store';
import { TextBody } from './text-body';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { BodyMode } from '@/lib/constants';

export function RequestBody() {
  const { isVertical } = useLayoutStore();
  const { bodyMode, setBodyMode } = useRequestConfig();

  return (
    <div className={cn('overflow-y-auto', isVertical() ? 'max-h-[35vh]' : 'max-h-[75vh]')}>
      <RadioGroup
        value={bodyMode}
        orientation="horizontal"
        className="flex"
        onValueChange={(value) => {
          setBodyMode(value as BodyMode);
        }}
      >
        {Object.entries(BodyMode).map(([key, value]) => {
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
      {bodyMode === BodyMode.Binary && <div>Binary</div>}
      {bodyMode === BodyMode.Text && <TextBody />}
      {bodyMode === BodyMode.JSON && <JsonBody />}
      {bodyMode === BodyMode.MultipartFormData && <div>FormData (Multipart)</div>}
      {bodyMode === BodyMode.UrlencodedFormData && <div>FormData (URL-Encoded)</div>}
    </div>
  );
}

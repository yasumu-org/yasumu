'use client';
import { Textarea } from '@/components/ui/textarea';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';

export function TextBody() {
  const { body, setBody } = useRequestConfig();

  return (
    <div className="h-full mt-4 border">
      <Textarea
        value={body.text || ''}
        onChange={(e) => {
          const element = e.target;

          element.style.height = 'auto';
          element.style.height = `${element.scrollHeight - 16}px`;

          setBody({
            text: e.target.value || '',
          });
        }}
      />
    </div>
  );
}

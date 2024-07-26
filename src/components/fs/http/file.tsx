import { File as FileItem } from '@/components/magicui/file-tree';
import { HttpMethodColors, HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface FileUIProps {
  method?: HttpMethods;
}

export function FileUI({
  method,
  ...rest
}: FileUIProps & React.ComponentProps<typeof FileItem>) {
  const color = method && HttpMethodColors[method];

  return (
    <FileItem
      {...rest}
      fileIcon={
        color ? (
          <span className={cn('text-xs font-bold uppercase rounded-lg', color)}>
            {method.length <= 5 ? method : method.substring(0, 3)}
          </span>
        ) : undefined
      }
    />
  );
}

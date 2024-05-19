'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Theme } from './theme';
import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/use-mounted';
import { Skeleton } from '@/components/ui/skeleton';

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceForm() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (theme ?? 'light') as AppearanceFormValues['theme'],
    },
  });

  function onSubmit(data: AppearanceFormValues) {
    const { theme } = data;

    setTheme(theme);

    toast({
      title: 'Settings updated successfully.',
      description: `The theme has been set to ${theme}.`,
      duration: 3000,
    });
  }

  if (!mounted)
    return (
      <div>
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-6 my-4">
          <Skeleton className="h-36 w-36" />
          <Skeleton className="h-36 w-36" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the application.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <Theme />
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <Theme dark />
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

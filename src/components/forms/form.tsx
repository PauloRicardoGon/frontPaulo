'use client';

import * as React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const Form = FormProvider;

export const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props} />
);

export const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-sm font-semibold text-neutral-800">{children}</Label>
);

export const FormControl = ({ children }: { children: React.ReactNode }) => {
  const form = useFormContext();
  return React.cloneElement(children as React.ReactElement, {
    ...((children as React.ReactElement).props ?? {}),
    'aria-invalid': form?.formState?.errors ? true : undefined,
  });
};

export const FormMessage = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const message = errors[name]?.message;
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{String(message)}</p>;
};

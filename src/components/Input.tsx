import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';

const inputVariants = cva(
  'focus-ring w-full rounded-control border bg-background-surface text-text-primary placeholder:text-text-secondary disabled:cursor-not-allowed disabled:bg-background-subtle disabled:text-text-disabled',
  {
    variants: {
      size: {
        sm: 'min-h-9 px-3 py-3 text-sm',
        md: 'min-h-[42px] px-4 py-3 text-sm',
      },
      state: {
        default: 'border-border-default',
        error: 'border-border-feedback-error',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

export type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> &
  VariantProps<typeof inputVariants>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      state,
      type = 'text',
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={state === 'error' ? true : ariaInvalid}
      className={cn(inputVariants({ size, state }), className)}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'focus-ring rounded-control inline-flex items-center justify-center gap-3 font-semibold disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-background-primary text-text-inverse hover:bg-background-primary-hover disabled:bg-background-primary-disabled disabled:text-text-disabled',
        secondary:
          'border border-border-subtle bg-background-secondary text-text-primary hover:bg-background-secondary-hover disabled:bg-background-secondary-disabled disabled:text-text-disabled',
      },
      size: {
        sm: 'min-h-[34px] px-3',
        md: 'min-h-[42px] px-4',
        icon: 'size-[42px] p-0',
        'icon-sm': 'size-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = 'Button';

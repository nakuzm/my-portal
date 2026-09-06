import * as Popover from '@radix-ui/react-popover';
import { cva } from 'class-variance-authority';
import { Search } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { Input, type InputSize } from '../Input';

const searchOptionVariants = cva(
  'flex w-full cursor-pointer items-center justify-between gap-3 rounded-control text-text-primary outline-none hover:bg-background-secondary-hover',
  {
    variants: {
      size: {
        sm: 'min-h-9 px-3 py-3 text-sm',
        md: 'min-h-[42px] px-4 py-3 text-sm',
      },
      active: {
        true: 'bg-background-secondary',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  },
);

type SearchDropdownSize = InputSize;

export type SearchDropdownOption<T = string> = {
  key?: string;
  value: T;
  label: string;
  disabled?: boolean;
};

type SearchDropdownProps<T = string> = {
  id?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  value: string;
  options: SearchDropdownOption<T>[];
  placeholder?: string;
  minQueryLengthToOpen?: number;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  dropdownTop?: ReactNode;
  optionTemplate?: (option: SearchDropdownOption<T>) => ReactNode;
  onChange: (value: string) => void;
  onSelect?: (option: SearchDropdownOption<T>) => void;
  autoFocus?: boolean;
  searchDropdownSize?: SearchDropdownSize;
};

export function SearchDropdown<T = string>({
  id,
  name,
  label,
  disabled = false,
  value,
  options,
  placeholder = 'Search...',
  minQueryLengthToOpen = 0,
  className,
  inputClassName,
  dropdownClassName,
  dropdownTop,
  optionTemplate,
  onChange,
  onSelect,
  autoFocus,
  searchDropdownSize = 'md',
}: SearchDropdownProps<T>) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id ?? `${generatedId}-input`;
  const listboxId = `${generatedId}-listbox`;
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const canOpen = value.trim().length >= minQueryLengthToOpen;
  const visibleOptions = canOpen
    ? options.filter((option) => !option.disabled)
    : [];
  const isOpen = isFocused && canOpen && visibleOptions.length > 0 && !disabled;
  const activeOption = visibleOptions[activeIndex];
  const activeOptionId = activeOption
    ? getOptionId(activeOption, activeIndex, generatedId)
    : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveIndex(0);
    setIsFocused(true);
    onChange(event.target.value);
  };

  const handleSelect = (option: SearchDropdownOption<T>) => {
    if (option.disabled) {
      return;
    }

    onSelect?.(option);
    setIsFocused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && event.key !== 'Escape') {
      return;
    }

    if (event.key === 'ArrowDown' && visibleOptions.length > 0) {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        Math.min(currentIndex + 1, visibleOptions.length - 1),
      );
    }

    if (event.key === 'ArrowUp' && visibleOptions.length > 0) {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (event.key === 'Enter' && activeOption) {
      event.preventDefault();
      handleSelect(activeOption);
    }

    if (event.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <Popover.Root open={isOpen}>
      <div className={cn('relative w-full', className)}>
        <Popover.Anchor asChild>
          <label htmlFor={inputId} className="grid gap-2">
            {label && (
              <span className="text-label-default font-label-default text-text-secondary">
                {label}
              </span>
            )}
            <div className="relative">
              <Search
                aria-hidden="true"
                className="text-icon-secondary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
              />
              <Input
                ref={inputRef}
                id={inputId}
                name={name}
                type="search"
                role="combobox"
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-activedescendant={isOpen ? activeOptionId : undefined}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={cn('pl-[42px]', inputClassName)}
                size={searchDropdownSize}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </label>
        </Popover.Anchor>
      </div>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onMouseDown={(event) => event.preventDefault()}
          style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
          className={cn(
            'rounded-surface border-border-subtle bg-background-surface z-30 max-h-72 overflow-auto border p-2 shadow-lg outline-none',
            dropdownClassName,
          )}
        >
          {dropdownTop}
          <div id={listboxId} role="listbox">
            {visibleOptions.map((option, index) => {
              const optionId = getOptionId(option, index, generatedId);

              return (
                <div
                  key={optionId}
                  id={optionId}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    searchOptionVariants({
                      size: searchDropdownSize,
                      active: index === activeIndex,
                    }),
                  )}
                >
                  {optionTemplate ? (
                    optionTemplate(option)
                  ) : (
                    <span>{option.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function getOptionId<T>(
  option: SearchDropdownOption<T>,
  index: number,
  prefix: string,
) {
  return `${prefix}-${option.key ?? `${option.label}-${index}`}`;
}

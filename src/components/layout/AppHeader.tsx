import type { ReactNode } from 'react';

type AppHeaderProps = {
  children: ReactNode;
};

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="border-border-subtle bg-surface border-b">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-5 px-6 py-5 max-lg:flex-col max-lg:items-stretch max-lg:px-4">
        {children}
      </div>
    </header>
  );
}

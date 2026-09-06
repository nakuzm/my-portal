import type { ReactNode } from 'react';

type AppMainProps = {
  children: ReactNode;
};

export function AppMain({ children }: AppMainProps) {
  return (
    <main className="mx-auto grid w-full max-w-[1440px] gap-5 px-6 py-5 pb-7 max-lg:px-4">
      {children}
    </main>
  );
}

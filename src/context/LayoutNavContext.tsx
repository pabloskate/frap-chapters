import type { ReactNode } from 'react';
import { LayoutNavContext } from './layoutNavStore';

export function LayoutNavProvider({
  children,
  openChat,
}: {
  children: ReactNode;
  openChat: () => void;
}) {
  return (
    <LayoutNavContext.Provider value={{ openChat }}>
      {children}
    </LayoutNavContext.Provider>
  );
}

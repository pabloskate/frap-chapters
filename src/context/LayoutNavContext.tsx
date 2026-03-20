import { createContext, useContext, type ReactNode } from 'react';

export interface LayoutNavContextValue {
  openChat: () => void;
}

const LayoutNavContext = createContext<LayoutNavContextValue | null>(null);

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

export function useLayoutNav() {
  const value = useContext(LayoutNavContext);

  if (!value) {
    throw new Error('useLayoutNav must be used within LayoutNavProvider');
  }

  return value;
}

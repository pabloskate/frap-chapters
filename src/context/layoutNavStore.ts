import { createContext } from 'react';

export interface LayoutNavContextValue {
  openChat: () => void;
}

export const LayoutNavContext = createContext<LayoutNavContextValue | null>(null);

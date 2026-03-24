import { useContext } from 'react';
import { LayoutNavContext } from './layoutNavStore';

export function useLayoutNav() {
  const value = useContext(LayoutNavContext);

  if (!value) {
    throw new Error('useLayoutNav must be used within LayoutNavProvider');
  }

  return value;
}

import { useEffect, useRef, useCallback } from 'react';

export type KeyMap = Record<string, boolean>;

export const useKeyboard = () => {
  const keysRef = useRef<KeyMap>({});

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = true;
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const isKeyPressed = useCallback((key: string): boolean => {
    return keysRef.current[key] || false;
  }, []);

  const isAnyKeyPressed = useCallback((keys: string[]): boolean => {
    return keys.some(key => keysRef.current[key]);
  }, []);

  return {
    isKeyPressed,
    isAnyKeyPressed,
    keys: keysRef.current,
  };
};

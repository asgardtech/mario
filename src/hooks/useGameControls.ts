import { useEffect, useState } from 'react';
import type { Controls } from '@/types';
import { KEYBOARD_CONTROLS } from '@/constants';

export function useGameControls(): Controls {
  const [controls, setControls] = useState<Controls>({
    moveLeft: false,
    moveRight: false,
    jump: false,
    run: false,
    action: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;

      if (KEYBOARD_CONTROLS.MOVE_LEFT.includes(key)) {
        setControls((prev) => ({ ...prev, moveLeft: true }));
      }
      if (KEYBOARD_CONTROLS.MOVE_RIGHT.includes(key)) {
        setControls((prev) => ({ ...prev, moveRight: true }));
      }
      if (KEYBOARD_CONTROLS.JUMP.includes(key)) {
        setControls((prev) => ({ ...prev, jump: true }));
      }
      if (KEYBOARD_CONTROLS.RUN.includes(key)) {
        setControls((prev) => ({ ...prev, run: true }));
      }
      if (KEYBOARD_CONTROLS.ACTION.includes(key)) {
        setControls((prev) => ({ ...prev, action: true }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.code;

      if (KEYBOARD_CONTROLS.MOVE_LEFT.includes(key)) {
        setControls((prev) => ({ ...prev, moveLeft: false }));
      }
      if (KEYBOARD_CONTROLS.MOVE_RIGHT.includes(key)) {
        setControls((prev) => ({ ...prev, moveRight: false }));
      }
      if (KEYBOARD_CONTROLS.JUMP.includes(key)) {
        setControls((prev) => ({ ...prev, jump: false }));
      }
      if (KEYBOARD_CONTROLS.RUN.includes(key)) {
        setControls((prev) => ({ ...prev, run: false }));
      }
      if (KEYBOARD_CONTROLS.ACTION.includes(key)) {
        setControls((prev) => ({ ...prev, action: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
}

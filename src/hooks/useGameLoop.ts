import { useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useGameActions } from './useGameActions';
import { GAME_CONSTANTS } from '@/constants/game';

export const useGameLoop = (onUpdate?: (deltaTime: number) => void) => {
  const { state } = useGame();
  const { updateTime } = useGameActions();
  const lastUpdateRef = useRef<number>(0);
  const timeAccumulatorRef = useRef<number>(0);

  useEffect(() => {
    if (state.status !== 'playing' || state.isPaused) {
      return;
    }

    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      if (lastUpdateRef.current === 0) {
        lastUpdateRef.current = timestamp;
      }

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;

      timeAccumulatorRef.current += deltaTime;

      if (timeAccumulatorRef.current >= 1000) {
        const secondsElapsed = Math.floor(timeAccumulatorRef.current / 1000);
        timeAccumulatorRef.current %= 1000;
        updateTime(state.time - secondsElapsed);
      }

      if (onUpdate) {
        onUpdate(deltaTime);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastUpdateRef.current = 0;
    };
  }, [state.status, state.isPaused, state.time, updateTime, onUpdate]);
};

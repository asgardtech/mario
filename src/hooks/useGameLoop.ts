import { useEffect, useRef } from 'react';

interface GameLoopOptions {
  onUpdate: (deltaTime: number) => void;
  fps?: number;
  isPaused?: boolean;
}

export function useGameLoop({
  onUpdate,
  fps = 60,
  isPaused = false,
}: GameLoopOptions) {
  const frameRef = useRef<number>();
  const onUpdateRef = useRef(onUpdate);
  const fpsInterval = 1000 / fps;

  // Keep the ref updated with the latest onUpdate callback
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (isPaused) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    let then = Date.now();

    const gameLoop = () => {
      frameRef.current = requestAnimationFrame(gameLoop);

      const now = Date.now();
      const elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        const deltaTime = elapsed / 1000;
        onUpdateRef.current(deltaTime);
      }
    };

    gameLoop();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [fpsInterval, isPaused]);
}

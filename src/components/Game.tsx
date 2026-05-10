import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/gameEngine';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 40, 1200);
      const height = Math.min(window.innerHeight - 100, 600);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    if (engineRef.current) {
      engineRef.current.resize(dimensions.width, dimensions.height);
    }
  }, [dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 p-4">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-center text-gray-800">Mario Game</h1>
        <p className="text-center text-gray-600 mt-2">Use Arrow Keys to move, Space to jump</p>
      </div>
      <div className="shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800">
        <canvas
          ref={canvasRef}
          className="block bg-sky-400"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Explore the platformer world!</p>
      </div>
    </div>
  );
}

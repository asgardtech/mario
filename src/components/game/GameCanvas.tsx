import { GameEngine } from '@/features/game-engine';

export function GameCanvas() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-white">Mario Game</h1>
      </div>
      <GameEngine />
    </div>
  );
}

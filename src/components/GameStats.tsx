import { useGame } from '@/contexts/GameContext';

export const GameStats = () => {
  const { state } = useGame();

  return (
    <div className="flex gap-6 items-center justify-center p-4 bg-slate-900 text-white font-mono">
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">SCORE</span>
        <span className="text-lg font-bold">{state.score.toString().padStart(6, '0')}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">COINS</span>
        <span className="text-lg font-bold">×{state.coins}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">WORLD</span>
        <span className="text-lg font-bold">1-{state.currentLevel + 1}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">TIME</span>
        <span className="text-lg font-bold">{state.time}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">LIVES</span>
        <span className="text-lg font-bold">×{state.lives}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">STATUS</span>
        <span className="text-lg font-bold uppercase">{state.status}</span>
      </div>
    </div>
  );
};

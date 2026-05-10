import { useGame } from '@/contexts/GameContext';
import { useGameActions } from '@/hooks/useGameActions';
import { Button } from '@/components/ui/button';

export const GameControls = () => {
  const { state } = useGame();
  const {
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    collectCoin,
    addScore,
    playerJump,
    playerHit,
  } = useGameActions();

  const handleStartPause = () => {
    if (state.status === 'idle') {
      startGame();
    } else if (state.status === 'playing') {
      pauseGame();
    } else if (state.status === 'paused') {
      resumeGame();
    }
  };

  const getButtonText = () => {
    if (state.status === 'idle') return 'Start Game';
    if (state.status === 'playing') return 'Pause';
    if (state.status === 'paused') return 'Resume';
    if (state.status === 'gameOver') return 'Game Over';
    if (state.status === 'levelComplete') return 'Level Complete';
    return 'Start';
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex gap-2 justify-center">
        <Button onClick={handleStartPause} disabled={state.status === 'gameOver'}>
          {getButtonText()}
        </Button>
        <Button onClick={resetGame} variant="outline">
          Reset
        </Button>
      </div>

      {state.status === 'playing' && (
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={() => collectCoin('demo-coin-1')} size="sm" variant="secondary">
            Collect Coin
          </Button>
          <Button onClick={() => addScore(100)} size="sm" variant="secondary">
            +100 Score
          </Button>
          <Button onClick={playerJump} size="sm" variant="secondary">
            Jump
          </Button>
          <Button onClick={playerHit} size="sm" variant="destructive">
            Take Hit
          </Button>
        </div>
      )}
    </div>
  );
};

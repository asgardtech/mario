import { useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Vector2D, Direction, PowerUpType } from '@/types/game';

export const useGameActions = () => {
  const { dispatch } = useGame();

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, [dispatch]);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, [dispatch]);

  const gameOver = useCallback(() => {
    dispatch({ type: 'GAME_OVER' });
  }, [dispatch]);

  const levelComplete = useCallback(() => {
    dispatch({ type: 'LEVEL_COMPLETE' });
  }, [dispatch]);

  const nextLevel = useCallback(() => {
    dispatch({ type: 'NEXT_LEVEL' });
  }, [dispatch]);

  const restartLevel = useCallback(() => {
    dispatch({ type: 'RESTART_LEVEL' });
  }, [dispatch]);

  const updatePlayerPosition = useCallback((position: Vector2D) => {
    dispatch({ type: 'UPDATE_PLAYER_POSITION', payload: position });
  }, [dispatch]);

  const updatePlayerVelocity = useCallback((velocity: Vector2D) => {
    dispatch({ type: 'UPDATE_PLAYER_VELOCITY', payload: velocity });
  }, [dispatch]);

  const setPlayerDirection = useCallback((direction: Direction) => {
    dispatch({ type: 'SET_PLAYER_DIRECTION', payload: direction });
  }, [dispatch]);

  const playerJump = useCallback(() => {
    dispatch({ type: 'PLAYER_JUMP' });
  }, [dispatch]);

  const playerLand = useCallback(() => {
    dispatch({ type: 'PLAYER_LAND' });
  }, [dispatch]);

  const collectCoin = useCallback((coinId: string) => {
    dispatch({ type: 'COLLECT_COIN', payload: coinId });
  }, [dispatch]);

  const collectPowerUp = useCallback((id: string, type: PowerUpType) => {
    dispatch({ type: 'COLLECT_POWER_UP', payload: { id, type } });
  }, [dispatch]);

  const playerHit = useCallback(() => {
    dispatch({ type: 'PLAYER_HIT' });
  }, [dispatch]);

  const defeatEnemy = useCallback((enemyId: string) => {
    dispatch({ type: 'DEFEAT_ENEMY', payload: enemyId });
  }, [dispatch]);

  const activateBlock = useCallback((blockId: string) => {
    dispatch({ type: 'ACTIVATE_BLOCK', payload: blockId });
  }, [dispatch]);

  const addScore = useCallback((points: number) => {
    dispatch({ type: 'ADD_SCORE', payload: points });
  }, [dispatch]);

  const loseLife = useCallback(() => {
    dispatch({ type: 'LOSE_LIFE' });
  }, [dispatch]);

  const gainLife = useCallback(() => {
    dispatch({ type: 'GAIN_LIFE' });
  }, [dispatch]);

  const updateTime = useCallback((time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  return {
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    levelComplete,
    nextLevel,
    restartLevel,
    updatePlayerPosition,
    updatePlayerVelocity,
    setPlayerDirection,
    playerJump,
    playerLand,
    collectCoin,
    collectPowerUp,
    playerHit,
    defeatEnemy,
    activateBlock,
    addScore,
    loseLife,
    gainLife,
    updateTime,
    resetGame,
  };
};

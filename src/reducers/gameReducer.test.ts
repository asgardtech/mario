import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialGameState } from './gameReducer';
import { GameState } from '@/types/game';
import { GAME_CONSTANTS, SCORE_VALUES } from '@/constants/game';

describe('gameReducer', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = createInitialGameState();
  });

  describe('game control actions', () => {
    it('should start the game', () => {
      const newState = gameReducer(initialState, { type: 'START_GAME' });
      expect(newState.status).toBe('playing');
      expect(newState.isPaused).toBe(false);
    });

    it('should pause the game', () => {
      const playingState = gameReducer(initialState, { type: 'START_GAME' });
      const pausedState = gameReducer(playingState, { type: 'PAUSE_GAME' });
      expect(pausedState.status).toBe('paused');
      expect(pausedState.isPaused).toBe(true);
    });

    it('should resume the game', () => {
      const playingState = gameReducer(initialState, { type: 'START_GAME' });
      const pausedState = gameReducer(playingState, { type: 'PAUSE_GAME' });
      const resumedState = gameReducer(pausedState, { type: 'RESUME_GAME' });
      expect(resumedState.status).toBe('playing');
      expect(resumedState.isPaused).toBe(false);
    });

    it('should end the game', () => {
      const newState = gameReducer(initialState, { type: 'GAME_OVER' });
      expect(newState.status).toBe('gameOver');
    });

    it('should reset the game', () => {
      const playingState = gameReducer(initialState, { type: 'START_GAME' });
      const modifiedState = { ...playingState, score: 1000, coins: 50 };
      const resetState = gameReducer(modifiedState, { type: 'RESET_GAME' });
      expect(resetState).toEqual(createInitialGameState());
    });
  });

  describe('player actions', () => {
    it('should update player position', () => {
      const newPosition = { x: 100, y: 200 };
      const newState = gameReducer(initialState, {
        type: 'UPDATE_PLAYER_POSITION',
        payload: newPosition,
      });
      expect(newState.player.position).toEqual(newPosition);
    });

    it('should update player velocity', () => {
      const newVelocity = { x: 5, y: -10 };
      const newState = gameReducer(initialState, {
        type: 'UPDATE_PLAYER_VELOCITY',
        payload: newVelocity,
      });
      expect(newState.player.velocity).toEqual(newVelocity);
    });

    it('should set player direction', () => {
      const newState = gameReducer(initialState, {
        type: 'SET_PLAYER_DIRECTION',
        payload: 'left',
      });
      expect(newState.player.direction).toBe('left');
    });

    it('should make player jump when grounded', () => {
      const newState = gameReducer(initialState, { type: 'PLAYER_JUMP' });
      expect(newState.player.isJumping).toBe(true);
      expect(newState.player.isGrounded).toBe(false);
      expect(newState.player.velocity.y).toBeLessThan(0);
    });

    it('should not jump when already jumping', () => {
      const jumpingState = gameReducer(initialState, { type: 'PLAYER_JUMP' });
      const newState = gameReducer(jumpingState, { type: 'PLAYER_JUMP' });
      expect(newState).toEqual(jumpingState);
    });

    it('should land the player', () => {
      const jumpingState = gameReducer(initialState, { type: 'PLAYER_JUMP' });
      const landedState = gameReducer(jumpingState, { type: 'PLAYER_LAND' });
      expect(landedState.player.isJumping).toBe(false);
      expect(landedState.player.isGrounded).toBe(true);
      expect(landedState.player.velocity.y).toBe(0);
    });
  });

  describe('collectibles', () => {
    it('should collect a coin and increase score', () => {
      const stateWithCoin = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            coins: [{ id: 'coin1', position: { x: 100, y: 100 }, collected: false }],
          },
        ],
      };

      const newState = gameReducer(stateWithCoin, {
        type: 'COLLECT_COIN',
        payload: 'coin1',
      });

      expect(newState.coins).toBe(1);
      expect(newState.score).toBe(SCORE_VALUES.COIN);
      expect(newState.levels[0].coins[0].collected).toBe(true);
    });

    it('should grant life after collecting 100 coins', () => {
      const stateWith99Coins = {
        ...initialState,
        coins: 99,
        levels: [
          {
            ...initialState.levels[0],
            coins: [{ id: 'coin1', position: { x: 100, y: 100 }, collected: false }],
          },
        ],
      };

      const newState = gameReducer(stateWith99Coins, {
        type: 'COLLECT_COIN',
        payload: 'coin1',
      });

      expect(newState.coins).toBe(100);
      expect(newState.lives).toBe(initialState.lives + 1);
    });

    it('should collect a power-up', () => {
      const stateWithPowerUp = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            powerUps: [{ id: 'powerup1', type: 'big' as const, position: { x: 100, y: 100 }, collected: false }],
          },
        ],
      };

      const newState = gameReducer(stateWithPowerUp, {
        type: 'COLLECT_POWER_UP',
        payload: { id: 'powerup1', type: 'big' },
      });

      expect(newState.player.powerUpState).toBe('big');
      expect(newState.score).toBe(SCORE_VALUES.POWER_UP);
      expect(newState.levels[0].powerUps[0].collected).toBe(true);
    });

    it('should activate invincibility with star power-up', () => {
      const stateWithStar = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            powerUps: [{ id: 'star1', type: 'star' as const, position: { x: 100, y: 100 }, collected: false }],
          },
        ],
      };

      const newState = gameReducer(stateWithStar, {
        type: 'COLLECT_POWER_UP',
        payload: { id: 'star1', type: 'star' },
      });

      expect(newState.player.invincible).toBe(true);
      expect(newState.player.invincibilityTimer).toBe(GAME_CONSTANTS.STAR_POWER_DURATION);
    });
  });

  describe('combat and damage', () => {
    it('should defeat an enemy and add score', () => {
      const stateWithEnemy = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            enemies: [
              {
                id: 'enemy1',
                type: 'goomba' as const,
                position: { x: 100, y: 100 },
                velocity: { x: 1, y: 0 },
                isAlive: true,
              },
            ],
          },
        ],
      };

      const newState = gameReducer(stateWithEnemy, {
        type: 'DEFEAT_ENEMY',
        payload: 'enemy1',
      });

      expect(newState.levels[0].enemies[0].isAlive).toBe(false);
      expect(newState.score).toBe(SCORE_VALUES.GOOMBA);
    });

    it('should downgrade power-up when hit', () => {
      const bigMario = {
        ...initialState,
        player: { ...initialState.player, powerUpState: 'big' as const },
      };

      const newState = gameReducer(bigMario, { type: 'PLAYER_HIT' });

      expect(newState.player.powerUpState).toBe('small');
      expect(newState.player.invincible).toBe(true);
      expect(newState.lives).toBe(initialState.lives);
    });

    it('should lose life when small mario gets hit', () => {
      const newState = gameReducer(initialState, { type: 'PLAYER_HIT' });
      expect(newState.lives).toBe(initialState.lives - 1);
      expect(newState.player.invincible).toBe(true);
    });

    it('should not take damage when invincible', () => {
      const invincibleState = {
        ...initialState,
        player: { ...initialState.player, invincible: true },
      };

      const newState = gameReducer(invincibleState, { type: 'PLAYER_HIT' });
      expect(newState.lives).toBe(initialState.lives);
    });

    it('should trigger game over when lives reach zero', () => {
      const oneLiveState = { ...initialState, lives: 1 };
      const newState = gameReducer(oneLiveState, { type: 'PLAYER_HIT' });
      expect(newState.status).toBe('gameOver');
      expect(newState.lives).toBe(0);
    });
  });

  describe('level progression', () => {
    it('should complete level and add bonus score', () => {
      const playingState = { ...initialState, time: 200, score: 1000 };
      const newState = gameReducer(playingState, { type: 'LEVEL_COMPLETE' });

      expect(newState.status).toBe('levelComplete');
      expect(newState.score).toBeGreaterThan(1000);
    });

    it('should advance to next level', () => {
      const newState = gameReducer(initialState, { type: 'NEXT_LEVEL' });
      expect(newState.currentLevel).toBe(1);
      expect(newState.status).toBe('playing');
      expect(newState.time).toBe(GAME_CONSTANTS.LEVEL_TIME_LIMIT);
    });

    it('should restart level', () => {
      const modifiedState = {
        ...initialState,
        score: 500,
        player: { ...initialState.player, position: { x: 500, y: 300 } },
      };

      const newState = gameReducer(modifiedState, { type: 'RESTART_LEVEL' });
      expect(newState.status).toBe('playing');
      expect(newState.time).toBe(GAME_CONSTANTS.LEVEL_TIME_LIMIT);
      expect(newState.player.position).not.toEqual({ x: 500, y: 300 });
    });
  });

  describe('score and time management', () => {
    it('should add score', () => {
      const newState = gameReducer(initialState, {
        type: 'ADD_SCORE',
        payload: 500,
      });
      expect(newState.score).toBe(500);
    });

    it('should update time', () => {
      const newState = gameReducer(initialState, {
        type: 'UPDATE_TIME',
        payload: 200,
      });
      expect(newState.time).toBe(200);
    });

    it('should trigger game over when time runs out', () => {
      const newState = gameReducer(initialState, {
        type: 'UPDATE_TIME',
        payload: 0,
      });
      expect(newState.status).toBe('gameOver');
      expect(newState.time).toBe(0);
    });

    it('should gain life', () => {
      const newState = gameReducer(initialState, { type: 'GAIN_LIFE' });
      expect(newState.lives).toBe(initialState.lives + 1);
    });

    it('should lose life', () => {
      const newState = gameReducer(initialState, { type: 'LOSE_LIFE' });
      expect(newState.lives).toBe(initialState.lives - 1);
    });
  });

  describe('block interactions', () => {
    it('should activate a block', () => {
      const stateWithBlock = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            blocks: [
              {
                id: 'block1',
                type: 'question' as const,
                position: { x: 100, y: 100 },
                isBreakable: false,
                isBroken: false,
                isActivated: false,
              },
            ],
          },
        ],
      };

      const newState = gameReducer(stateWithBlock, {
        type: 'ACTIVATE_BLOCK',
        payload: 'block1',
      });

      expect(newState.levels[0].blocks[0].isActivated).toBe(true);
    });

    it('should add score when breaking a block', () => {
      const stateWithBreakableBlock = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            blocks: [
              {
                id: 'block1',
                type: 'brick' as const,
                position: { x: 100, y: 100 },
                isBreakable: true,
                isBroken: false,
                isActivated: false,
              },
            ],
          },
        ],
      };

      const newState = gameReducer(stateWithBreakableBlock, {
        type: 'ACTIVATE_BLOCK',
        payload: 'block1',
      });

      expect(newState.score).toBe(SCORE_VALUES.BLOCK_BREAK);
      expect(newState.levels[0].blocks[0].isBroken).toBe(true);
    });

    it('should not activate already activated block', () => {
      const stateWithActivatedBlock = {
        ...initialState,
        levels: [
          {
            ...initialState.levels[0],
            blocks: [
              {
                id: 'block1',
                type: 'question' as const,
                position: { x: 100, y: 100 },
                isBreakable: false,
                isBroken: false,
                isActivated: true,
              },
            ],
          },
        ],
      };

      const newState = gameReducer(stateWithActivatedBlock, {
        type: 'ACTIVATE_BLOCK',
        payload: 'block1',
      });

      expect(newState).toEqual(stateWithActivatedBlock);
    });
  });
});

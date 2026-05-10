import { GameState, GameAction, PlayerState, Level } from '@/types/game';
import { GAME_CONSTANTS, PLAYER_CONSTANTS, SCORE_VALUES, SPAWN_POINT } from '@/constants/game';

const createInitialPlayerState = (): PlayerState => ({
  position: { ...SPAWN_POINT },
  velocity: { x: 0, y: 0 },
  direction: 'right',
  isJumping: false,
  isGrounded: true,
  powerUpState: 'small',
  invincible: false,
  invincibilityTimer: 0,
});

const createInitialLevel = (): Level => ({
  id: 1,
  name: 'World 1-1',
  timeLimit: GAME_CONSTANTS.LEVEL_TIME_LIMIT,
  enemies: [],
  coins: [],
  powerUps: [],
  blocks: [],
  spawnPoint: { ...SPAWN_POINT },
  exitPoint: { x: 3000, y: 400 },
});

export const createInitialGameState = (): GameState => ({
  status: 'idle',
  player: createInitialPlayerState(),
  currentLevel: 0,
  levels: [createInitialLevel()],
  score: 0,
  coins: 0,
  lives: GAME_CONSTANTS.INITIAL_LIVES,
  time: GAME_CONSTANTS.INITIAL_TIME,
  isPaused: false,
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: 'playing',
        isPaused: false,
        time: GAME_CONSTANTS.INITIAL_TIME,
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        status: 'paused',
        isPaused: true,
      };

    case 'RESUME_GAME':
      return {
        ...state,
        status: 'playing',
        isPaused: false,
      };

    case 'GAME_OVER':
      return {
        ...state,
        status: 'gameOver',
      };

    case 'LEVEL_COMPLETE':
      return {
        ...state,
        status: 'levelComplete',
        score: state.score + SCORE_VALUES.LEVEL_COMPLETE + (state.time * SCORE_VALUES.TIME_BONUS_MULTIPLIER),
      };

    case 'NEXT_LEVEL': {
      const nextLevelIndex = state.currentLevel + 1;
      return {
        ...state,
        currentLevel: nextLevelIndex,
        status: 'playing',
        time: GAME_CONSTANTS.LEVEL_TIME_LIMIT,
        player: {
          ...createInitialPlayerState(),
          powerUpState: state.player.powerUpState,
        },
      };
    }

    case 'RESTART_LEVEL':
      return {
        ...state,
        status: 'playing',
        time: GAME_CONSTANTS.LEVEL_TIME_LIMIT,
        player: createInitialPlayerState(),
      };

    case 'UPDATE_PLAYER_POSITION':
      return {
        ...state,
        player: {
          ...state.player,
          position: action.payload,
        },
      };

    case 'UPDATE_PLAYER_VELOCITY':
      return {
        ...state,
        player: {
          ...state.player,
          velocity: {
            x: Math.max(-PLAYER_CONSTANTS.MAX_VELOCITY_X, Math.min(PLAYER_CONSTANTS.MAX_VELOCITY_X, action.payload.x)),
            y: Math.max(-PLAYER_CONSTANTS.MAX_VELOCITY_Y, Math.min(PLAYER_CONSTANTS.MAX_VELOCITY_Y, action.payload.y)),
          },
        },
      };

    case 'SET_PLAYER_DIRECTION':
      return {
        ...state,
        player: {
          ...state.player,
          direction: action.payload,
        },
      };

    case 'PLAYER_JUMP':
      if (state.player.isGrounded && !state.player.isJumping) {
        return {
          ...state,
          player: {
            ...state.player,
            isJumping: true,
            isGrounded: false,
            velocity: {
              ...state.player.velocity,
              y: PLAYER_CONSTANTS.JUMP_FORCE,
            },
          },
        };
      }
      return state;

    case 'PLAYER_LAND':
      return {
        ...state,
        player: {
          ...state.player,
          isJumping: false,
          isGrounded: true,
          velocity: {
            ...state.player.velocity,
            y: 0,
          },
        },
      };

    case 'COLLECT_COIN': {
      const currentLevel = state.levels[state.currentLevel];
      const updatedCoins = currentLevel.coins.map(coin =>
        coin.id === action.payload ? { ...coin, collected: true } : coin
      );

      const updatedLevels = [...state.levels];
      updatedLevels[state.currentLevel] = {
        ...currentLevel,
        coins: updatedCoins,
      };

      const newCoinCount = state.coins + 1;
      const shouldGainLife = newCoinCount > 0 && newCoinCount % 100 === 0;

      return {
        ...state,
        coins: newCoinCount,
        score: state.score + SCORE_VALUES.COIN,
        lives: shouldGainLife ? state.lives + 1 : state.lives,
        levels: updatedLevels,
      };
    }

    case 'COLLECT_POWER_UP': {
      const currentLevel = state.levels[state.currentLevel];
      const updatedPowerUps = currentLevel.powerUps.map(powerUp =>
        powerUp.id === action.payload.id ? { ...powerUp, collected: true } : powerUp
      );

      const updatedLevels = [...state.levels];
      updatedLevels[state.currentLevel] = {
        ...currentLevel,
        powerUps: updatedPowerUps,
      };

      return {
        ...state,
        player: {
          ...state.player,
          powerUpState: action.payload.type,
          invincible: action.payload.type === 'star',
          invincibilityTimer: action.payload.type === 'star' ? GAME_CONSTANTS.STAR_POWER_DURATION : state.player.invincibilityTimer,
        },
        score: state.score + SCORE_VALUES.POWER_UP,
        levels: updatedLevels,
      };
    }

    case 'PLAYER_HIT':
      if (state.player.invincible) {
        return state;
      }

      if (state.player.powerUpState === 'small') {
        return {
          ...state,
          lives: state.lives - 1,
          status: state.lives - 1 <= 0 ? 'gameOver' : state.status,
          player: {
            ...state.player,
            invincible: true,
            invincibilityTimer: GAME_CONSTANTS.INVINCIBILITY_DURATION,
          },
        };
      }

      return {
        ...state,
        player: {
          ...state.player,
          powerUpState: 'small',
          invincible: true,
          invincibilityTimer: GAME_CONSTANTS.INVINCIBILITY_DURATION,
        },
      };

    case 'DEFEAT_ENEMY': {
      const currentLevel = state.levels[state.currentLevel];
      const enemy = currentLevel.enemies.find(e => e.id === action.payload);

      const updatedEnemies = currentLevel.enemies.map(e =>
        e.id === action.payload ? { ...e, isAlive: false } : e
      );

      const updatedLevels = [...state.levels];
      updatedLevels[state.currentLevel] = {
        ...currentLevel,
        enemies: updatedEnemies,
      };

      const scoreIncrease = enemy ? SCORE_VALUES[enemy.type.toUpperCase() as keyof typeof SCORE_VALUES] || 100 : 100;

      return {
        ...state,
        score: state.score + scoreIncrease,
        levels: updatedLevels,
      };
    }

    case 'ACTIVATE_BLOCK': {
      const currentLevel = state.levels[state.currentLevel];
      const block = currentLevel.blocks.find(b => b.id === action.payload);

      if (!block || block.isActivated) {
        return state;
      }

      const updatedBlocks = currentLevel.blocks.map(b =>
        b.id === action.payload ? { ...b, isActivated: true, isBroken: b.isBreakable } : b
      );

      const updatedLevels = [...state.levels];
      updatedLevels[state.currentLevel] = {
        ...currentLevel,
        blocks: updatedBlocks,
      };

      return {
        ...state,
        score: state.score + (block.isBreakable ? SCORE_VALUES.BLOCK_BREAK : 0),
        levels: updatedLevels,
      };
    }

    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.payload,
      };

    case 'LOSE_LIFE': {
      const newLives = state.lives - 1;
      return {
        ...state,
        lives: newLives,
        status: newLives <= 0 ? 'gameOver' : state.status,
      };
    }

    case 'GAIN_LIFE':
      return {
        ...state,
        lives: state.lives + 1,
      };

    case 'UPDATE_TIME': {
      const newTime = Math.max(0, action.payload);
      return {
        ...state,
        time: newTime,
        status: newTime <= 0 ? 'gameOver' : state.status,
      };
    }

    case 'RESET_GAME':
      return createInitialGameState();

    default:
      return state;
  }
};

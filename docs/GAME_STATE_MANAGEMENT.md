# Game State Management Documentation

## Overview

This document describes the core game state management system implemented for the Mario platformer game. The system uses React Context and useReducer for centralized state management with full TypeScript support.

## Architecture

### Core Components

1. **Types** (`src/types/game.ts`)
   - Comprehensive TypeScript interfaces for all game entities
   - Type-safe action definitions
   - Strict type checking for game state

2. **Constants** (`src/constants/game.ts`)
   - Game physics constants (gravity, speed, jump force)
   - Score values for different actions
   - Player dimensions and movement parameters

3. **Reducer** (`src/reducers/gameReducer.ts`)
   - Pure function handling all state transitions
   - Immutable state updates
   - Business logic for game mechanics

4. **Context** (`src/contexts/GameContext.tsx`)
   - Global state provider
   - Action dispatcher
   - Custom hook for accessing game state

5. **Custom Hooks**
   - `useGameActions`: Action dispatchers for all game events
   - `useGameLoop`: Game loop with time management
   - `useKeyboard`: Keyboard input handling

## Game State Structure

```typescript
interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  player: PlayerState;
  currentLevel: number;
  levels: Level[];
  score: number;
  coins: number;
  lives: number;
  time: number;
  isPaused: boolean;
}
```

### Player State

- **Position & Velocity**: 2D vectors for physics simulation
- **Direction**: Current facing direction
- **Jump State**: Jumping and grounded flags
- **Power-up State**: small, big, fire, or star
- **Invincibility**: Timer-based invincibility system

### Level Management

Each level contains:
- Enemies with AI state
- Collectible coins
- Power-ups
- Interactive blocks
- Spawn and exit points

## Available Actions

### Game Control
- `START_GAME`: Initialize game session
- `PAUSE_GAME`: Pause gameplay
- `RESUME_GAME`: Resume from pause
- `GAME_OVER`: End game
- `LEVEL_COMPLETE`: Complete current level
- `NEXT_LEVEL`: Advance to next level
- `RESTART_LEVEL`: Restart current level
- `RESET_GAME`: Reset to initial state

### Player Actions
- `UPDATE_PLAYER_POSITION`: Move player
- `UPDATE_PLAYER_VELOCITY`: Update physics
- `SET_PLAYER_DIRECTION`: Change facing direction
- `PLAYER_JUMP`: Execute jump
- `PLAYER_LAND`: Land on ground
- `PLAYER_HIT`: Take damage

### Collectibles & Scoring
- `COLLECT_COIN`: Collect a coin (+100 score)
- `COLLECT_POWER_UP`: Collect power-up (+1000 score)
- `DEFEAT_ENEMY`: Defeat enemy (variable score)
- `ACTIVATE_BLOCK`: Hit/break block
- `ADD_SCORE`: Add arbitrary score

### Resource Management
- `LOSE_LIFE`: Lose a life
- `GAIN_LIFE`: Gain extra life (every 100 coins)
- `UPDATE_TIME`: Update level timer

## Game Mechanics

### Lives System
- Start with 3 lives
- Lose life when small Mario gets hit
- Gain life every 100 coins collected
- Game over when lives reach 0

### Power-up System
1. **Small**: Default state, one hit = lose life
2. **Big**: One hit = downgrade to small
3. **Fire**: One hit = downgrade to small
4. **Star**: Temporary invincibility (180 frames)

### Invincibility
- Activated on taking damage (120 frames)
- Activated by star power-up (180 frames)
- Prevents all damage while active

### Score System
- Coins: 100 points
- Power-ups: 1000 points
- Enemies: 100-400 points
- Block breaking: 50 points
- Level completion: 5000 + (time × 10) bonus

### Time System
- Each level has a time limit (300 seconds)
- Time decreases during gameplay
- Game over when time reaches 0
- Remaining time adds to score on level completion

## Usage Examples

### Basic Setup

```typescript
import { GameProvider } from '@/contexts/GameContext';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
```

### Using Game State

```typescript
import { useGame } from '@/contexts/GameContext';

function GameComponent() {
  const { state } = useGame();
  
  return (
    <div>
      <p>Score: {state.score}</p>
      <p>Lives: {state.lives}</p>
      <p>Status: {state.status}</p>
    </div>
  );
}
```

### Dispatching Actions

```typescript
import { useGameActions } from '@/hooks/useGameActions';

function GameControls() {
  const {
    startGame,
    pauseGame,
    playerJump,
    collectCoin
  } = useGameActions();
  
  return (
    <div>
      <button onClick={startGame}>Start</button>
      <button onClick={pauseGame}>Pause</button>
      <button onClick={playerJump}>Jump</button>
    </div>
  );
}
```

### Game Loop

```typescript
import { useGameLoop } from '@/hooks/useGameLoop';

function Game() {
  useGameLoop((deltaTime) => {
    // Update physics, check collisions, etc.
  });
  
  return <Canvas />;
}
```

### Keyboard Input

```typescript
import { useKeyboard } from '@/hooks/useKeyboard';

function PlayerController() {
  const { isKeyPressed } = useKeyboard();
  
  useEffect(() => {
    if (isKeyPressed('ArrowRight')) {
      // Move right
    }
    if (isKeyPressed(' ')) {
      // Jump
    }
  }, [isKeyPressed]);
}
```

## Testing

Comprehensive test suite covering:
- All game control actions
- Player movement and physics
- Collectible system
- Combat and damage
- Level progression
- Score management
- Block interactions

Run tests with:
```bash
npm test
```

## Future Enhancements

Potential additions to the state management:
- Multiplayer support
- Save/load game state
- Achievement system
- Sound effects state
- Animation state management
- Camera/viewport state
- Particle effects system
- Boss battle mechanics

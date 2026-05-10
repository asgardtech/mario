import type { Character, Controls } from '@/types';
import { PLAYER_CONFIG } from '@/constants';

export function createPlayer(): Character {
  return {
    id: 'player',
    name: 'Mario',
    x: PLAYER_CONFIG.START_X,
    y: PLAYER_CONFIG.START_Y,
    width: PLAYER_CONFIG.WIDTH,
    height: PLAYER_CONFIG.HEIGHT,
    velocity: { x: 0, y: 0 },
    health: PLAYER_CONFIG.INITIAL_HEALTH,
    maxHealth: PLAYER_CONFIG.MAX_HEALTH,
    lives: PLAYER_CONFIG.INITIAL_LIVES,
    score: 0,
    powerUpState: null,
    direction: 'right',
    isJumping: false,
    isOnGround: false,
    isActive: true,
  };
}

export function updatePlayer(
  player: Character,
  _controls: Controls,
  _deltaTime: number
): Character {
  // TODO: Implement player movement logic based on controls and physics
  // - Apply horizontal movement based on controls.left/right
  // - Apply jump velocity based on controls.jump
  // - Apply gravity and velocity updates
  // - Update player position based on velocity and deltaTime
  return player;
}

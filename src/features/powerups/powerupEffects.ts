import type { Character, PowerUpType } from '@/types';

export function applyPowerUp(
  player: Character,
  powerUpType: PowerUpType
): Character {
  switch (powerUpType) {
    case 'mushroom':
      return {
        ...player,
        maxHealth: 2,
        health: Math.max(player.health, 2),
        powerUpState: powerUpType,
      };
    case 'fire-flower':
      return {
        ...player,
        powerUpState: powerUpType,
      };
    case 'star':
      return {
        ...player,
        powerUpState: powerUpType,
      };
    default:
      return player;
  }
}

export function removePowerUp(player: Character): Character {
  return {
    ...player,
    powerUpState: null,
    maxHealth: 1,
    health: 1,
  };
}

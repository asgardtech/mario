import type { Character, PowerUpType } from '@/types';

export function applyPowerUp(
  player: Character,
  powerUpType: PowerUpType
): Character {
  switch (powerUpType) {
    case PowerUpType.Mushroom:
      return {
        ...player,
        maxHealth: 2,
        health: Math.max(player.health, 2),
        powerUpState: powerUpType,
      };
    case PowerUpType.FireFlower:
      return {
        ...player,
        powerUpState: powerUpType,
      };
    case PowerUpType.Star:
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

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
  // Only reset health if the power-up was a Mushroom (which increases max health)
  // Star and Fire Flower don't affect health, so we preserve it
  const shouldResetHealth = player.powerUpState === PowerUpType.Mushroom;

  return {
    ...player,
    powerUpState: null,
    maxHealth: shouldResetHealth ? 1 : player.maxHealth,
    health: shouldResetHealth ? Math.min(player.health, 1) : player.health,
  };
}

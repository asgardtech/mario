import type { Level } from '@/types';

export const level1: Level = {
  id: 'level-1',
  name: 'World 1-1',
  background: '#5c94fc',
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 3000, y: 400 },
  timeLimit: 400,
  platforms: [
    {
      id: 'ground-1',
      x: 0,
      y: 550,
      width: 3200,
      height: 50,
      type: 'solid',
      isActive: true,
    },
  ],
  enemies: [],
  powerUps: [],
};

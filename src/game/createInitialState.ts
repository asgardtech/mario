import { GameState, GameStateType } from "./types";
import { PLAYER, CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export function createInitialState(): GameState {
  return {
    player: {
      position: { x: 100, y: 100 },
      velocity: { x: 0, y: 0 },
      width: PLAYER.WIDTH,
      height: PLAYER.HEIGHT,
      isJumping: false,
      isGrounded: false,
    },
    level: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      platforms: [
        { x: 0, y: 550, width: 300, height: 50 },
        { x: 350, y: 450, width: 200, height: 50 },
        { x: 600, y: 350, width: 200, height: 50 },
        { x: 200, y: 250, width: 150, height: 50 },
      ],
    },
    isRunning: false,
    state: GameStateType.MENU,
    score: 0,
  };
}

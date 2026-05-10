import { GameState } from "./types";

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public clear(width: number, height: number): void {
    this.ctx.fillStyle = "#87CEEB";
    this.ctx.fillRect(0, 0, width, height);
  }

  public render(state: GameState): void {
    const { player, level } = state;

    this.ctx.fillStyle = "#8B4513";
    for (const platform of level.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    this.ctx.fillStyle = "#000000";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${state.score}`, 10, 30);
  }
}

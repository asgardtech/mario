import { GameState, Platform, Player, Vec2 } from './types';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  render(state: GameState) {
    this.clear();
    this.drawPlatforms(state.platforms, state.camera);
    this.drawPlayer(state.player, state.camera);
    this.drawUI(state);
  }

  private drawPlayer(player: Player, camera: Vec2) {
    const screenX = player.position.x - camera.x;
    const screenY = player.position.y - camera.y;

    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(screenX, screenY, player.width, player.height);

    this.ctx.fillStyle = '#000000';
    const eyeSize = 4;
    const eyeY = screenY + 10;
    if (player.isFacingRight) {
      this.ctx.fillRect(screenX + player.width - 15, eyeY, eyeSize, eyeSize);
    } else {
      this.ctx.fillRect(screenX + 11, eyeY, eyeSize, eyeSize);
    }

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(screenX + 5, screenY + player.height - 8, 10, 8);
    this.ctx.fillRect(screenX + player.width - 15, screenY + player.height - 8, 10, 8);
  }

  private drawPlatforms(platforms: Platform[], camera: Vec2) {
    platforms.forEach(platform => {
      const screenX = platform.position.x - camera.x;
      const screenY = platform.position.y - camera.y;

      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(screenX, screenY, platform.width, platform.height);

      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(screenX, screenY, platform.width, platform.height);
    });
  }

  private drawUI(state: GameState) {
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '24px monospace';
    this.ctx.fillText(`Score: ${state.score}`, 20, 40);

    if (!state.isPlaying) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '48px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Press SPACE to Start', this.width / 2, this.height / 2);
      this.ctx.font = '24px monospace';
      this.ctx.fillText('Arrow Keys to Move, Space to Jump', this.width / 2, this.height / 2 + 50);
      this.ctx.textAlign = 'left';
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

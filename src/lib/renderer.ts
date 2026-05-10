import { GameState, Platform, Player, Vec2, ParallaxLayer, Particle, Tile } from './types';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private parallaxLayers: ParallaxLayer[];

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;

    // Initialize parallax layers
    this.parallaxLayers = [
      { color: '#87CEEB', speed: 0, yOffset: 0, height: this.height }, // Sky
      { color: '#B0E0E6', speed: 0.1, yOffset: 0, height: 150 }, // Far clouds/mountains
      { color: '#ADD8E6', speed: 0.3, yOffset: 100, height: 200 }, // Mid clouds
      { color: '#D4F1F4', speed: 0.5, yOffset: 200, height: 150 }, // Near background
    ];
  }

  clear() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  render(state: GameState) {
    this.clear();
    this.drawParallaxLayers(state.camera);
    this.drawTiles(state.tileMap, state.camera);
    this.drawParticles(state.particles, state.camera);
    this.drawPlayer(state.player, state.camera);
    this.drawUI(state);
  }

  private drawParallaxLayers(camera: Vec2) {
    this.parallaxLayers.forEach(layer => {
      const offsetX = camera.x * layer.speed;
      const pattern = Math.floor(offsetX / this.width);
      const x = -(offsetX % this.width);

      this.ctx.fillStyle = layer.color;
      this.ctx.globalAlpha = 0.7;

      // Draw repeating pattern
      for (let i = -1; i <= 1; i++) {
        const drawX = x + i * this.width;
        this.ctx.fillRect(drawX, layer.yOffset, this.width, layer.height);

        // Add some decorative elements to make parallax visible
        if (layer.speed > 0) {
          this.ctx.fillStyle = this.lightenColor(layer.color, 20);
          const numShapes = 3;
          for (let j = 0; j < numShapes; j++) {
            const shapeX = drawX + (j * this.width / numShapes) + ((pattern + i) * 50) % (this.width / numShapes);
            const shapeY = layer.yOffset + layer.height * 0.3 + Math.sin((pattern + i + j) * 0.5) * 20;
            const shapeWidth = 60 + Math.sin((pattern + i + j) * 0.7) * 20;
            const shapeHeight = 30 + Math.cos((pattern + i + j) * 0.6) * 10;

            this.ctx.beginPath();
            this.ctx.ellipse(shapeX, shapeY, shapeWidth / 2, shapeHeight / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.fillStyle = layer.color;
        }
      }

      this.ctx.globalAlpha = 1.0;
    });
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
  }

  private drawTiles(tileMap: { tiles: Tile[][], tileWidth: number, tileHeight: number }, camera: Vec2) {
    // Culling: only draw tiles visible on screen
    const startCol = Math.max(0, Math.floor(camera.x / tileMap.tileWidth));
    const endCol = Math.min(
      tileMap.tiles[0].length,
      Math.ceil((camera.x + this.width) / tileMap.tileWidth)
    );
    const startRow = Math.max(0, Math.floor(camera.y / tileMap.tileHeight));
    const endRow = Math.min(
      tileMap.tiles.length,
      Math.ceil((camera.y + this.height) / tileMap.tileHeight)
    );

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = tileMap.tiles[row][col];
        if (tile.type !== 'empty') {
          const worldX = col * tileMap.tileWidth;
          const worldY = row * tileMap.tileHeight;
          const screenX = worldX - camera.x;
          const screenY = worldY - camera.y;

          this.ctx.fillStyle = tile.color;
          this.ctx.fillRect(screenX, screenY, tileMap.tileWidth, tileMap.tileHeight);

          // Add border for brick tiles
          if (tile.type === 'brick') {
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX, screenY, tileMap.tileWidth, tileMap.tileHeight);
          } else if (tile.type === 'ground') {
            // Add texture to ground tiles
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(screenX, screenY, tileMap.tileWidth, tileMap.tileHeight);
          }
        }
      }
    }
  }

  private drawParticles(particles: Particle[], camera: Vec2) {
    particles.forEach(particle => {
      const screenX = particle.position.x - camera.x;
      const screenY = particle.position.y - camera.y;

      const alpha = particle.lifetime / particle.maxLifetime;
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillRect(screenX, screenY, particle.size, particle.size);
      this.ctx.globalAlpha = 1.0;
    });
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
      this.ctx.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
      this.ctx.font = '24px monospace';
      this.ctx.fillText('Arrow Keys to Move, Space to Jump', this.width / 2, this.height / 2 + 50);
      this.ctx.textAlign = 'left';
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    // Update parallax layer heights
    if (this.parallaxLayers[0]) {
      this.parallaxLayers[0].height = this.height;
    }
  }

  getWidth(): number {
    return this.width;
  }
}

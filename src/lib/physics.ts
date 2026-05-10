import { GameState, Platform, Player, Vec2 } from './types';

const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const JUMP_FORCE = -12;
const MAX_FALL_SPEED = 15;
const WORLD_WIDTH = 2000;
const RESPAWN_Y_THRESHOLD = 700;

export class Physics {
  update(state: GameState, input: { left: boolean; right: boolean; jump: boolean }, deltaTime: number = 1, canvasWidth: number = 800) {
    if (!state.isPlaying) return;

    this.updatePlayer(state.player, input, deltaTime);
    this.applyGravity(state.player, deltaTime);
    this.handleCollisions(state.player, state.platforms);
    this.updateCamera(state.camera, state.player, canvasWidth);
  }

  private updatePlayer(player: Player, input: { left: boolean; right: boolean; jump: boolean }, deltaTime: number) {
    if (input.left) {
      player.velocity.x = -PLAYER_SPEED;
      player.isFacingRight = false;
    } else if (input.right) {
      player.velocity.x = PLAYER_SPEED;
      player.isFacingRight = true;
    } else {
      player.velocity.x = 0;
    }

    if (input.jump && !player.isJumping) {
      player.velocity.y = JUMP_FORCE;
      player.isJumping = true;
    }

    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;

    player.position.x = Math.max(0, Math.min(player.position.x, WORLD_WIDTH - player.width));

    if (player.position.y > RESPAWN_Y_THRESHOLD) {
      player.position = { x: 100, y: 400 };
      player.velocity = { x: 0, y: 0 };
      player.isJumping = false;
    }
  }

  private applyGravity(player: Player, deltaTime: number) {
    player.velocity.y += GRAVITY * deltaTime;
    if (player.velocity.y > MAX_FALL_SPEED) {
      player.velocity.y = MAX_FALL_SPEED;
    }
  }

  private handleCollisions(player: Player, platforms: Platform[]) {
    platforms.forEach(platform => {
      if (this.checkCollision(player, platform)) {
        const overlapX = Math.min(
          player.position.x + player.width - platform.position.x,
          platform.position.x + platform.width - player.position.x
        );
        const overlapY = Math.min(
          player.position.y + player.height - platform.position.y,
          platform.position.y + platform.height - player.position.y
        );

        if (overlapX < overlapY) {
          if (player.position.x < platform.position.x) {
            player.position.x = platform.position.x - player.width;
          } else {
            player.position.x = platform.position.x + platform.width;
          }
          player.velocity.x = 0;
        } else {
          if (player.position.y < platform.position.y) {
            player.position.y = platform.position.y - player.height;
            player.velocity.y = 0;
            player.isJumping = false;
          } else {
            player.position.y = platform.position.y + platform.height;
            player.velocity.y = 0;
          }
        }
      }
    });
  }

  private checkCollision(entity1: { position: Vec2; width: number; height: number }, entity2: { position: Vec2; width: number; height: number }): boolean {
    return (
      entity1.position.x < entity2.position.x + entity2.width &&
      entity1.position.x + entity1.width > entity2.position.x &&
      entity1.position.y < entity2.position.y + entity2.height &&
      entity1.position.y + entity1.height > entity2.position.y
    );
  }

  private updateCamera(camera: Vec2, player: Player, canvasWidth: number) {
    const targetX = player.position.x - canvasWidth / 2;
    camera.x = Math.max(0, targetX);
  }
}

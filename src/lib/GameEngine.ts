import { Player, Platform, InputState } from "@/types/game";

export class GameEngine {
  private readonly GRAVITY = 0.5;
  private readonly JUMP_FORCE = -12;
  private readonly MOVE_SPEED = 5;
  private readonly MAX_FALL_SPEED = 15;

  public updatePlayer(
    player: Player,
    input: InputState,
    platforms: Platform[],
    canvasWidth: number
  ): Player {
    const updated = { ...player };

    // Apply horizontal movement
    if (input.left) {
      updated.velocity.x = -this.MOVE_SPEED;
      updated.isFacingRight = false;
    } else if (input.right) {
      updated.velocity.x = this.MOVE_SPEED;
      updated.isFacingRight = true;
    } else {
      updated.velocity.x = 0;
    }

    // Apply jump
    if (input.jump && updated.isGrounded) {
      updated.velocity.y = this.JUMP_FORCE;
      updated.isGrounded = false;
    }

    // Apply gravity
    if (!updated.isGrounded) {
      updated.velocity.y += this.GRAVITY;
      if (updated.velocity.y > this.MAX_FALL_SPEED) {
        updated.velocity.y = this.MAX_FALL_SPEED;
      }
    }

    // Update position
    updated.position.x += updated.velocity.x;
    updated.position.y += updated.velocity.y;

    // Keep player within canvas bounds horizontally
    if (updated.position.x < 0) {
      updated.position.x = 0;
    } else if (updated.position.x + updated.width > canvasWidth) {
      updated.position.x = canvasWidth - updated.width;
    }

    // Check collisions with platforms
    updated.isGrounded = false;
    for (const platform of platforms) {
      if (this.checkCollision(updated, platform)) {
        // Calculate previous position before velocity was applied
        const prevY = updated.position.y - updated.velocity.y;
        const prevX = updated.position.x - updated.velocity.x;

        // Landing on top of platform
        if (
          updated.velocity.y > 0 &&
          prevY + updated.height <= platform.y &&
          updated.position.y + updated.height >= platform.y
        ) {
          updated.position.y = platform.y - updated.height;
          updated.velocity.y = 0;
          updated.isGrounded = true;
        }
        // Hitting bottom of platform
        else if (
          updated.velocity.y < 0 &&
          updated.position.y >= platform.y + platform.height
        ) {
          updated.position.y = platform.y + platform.height;
          updated.velocity.y = 0;
        }
        // Hitting side of platform
        else {
          if (updated.velocity.x > 0) {
            updated.position.x = platform.x - updated.width;
          } else if (updated.velocity.x < 0) {
            updated.position.x = platform.x + platform.width;
          }
          updated.velocity.x = 0;
        }
      }
    }

    return updated;
  }

  private checkCollision(player: Player, platform: Platform): boolean {
    return (
      player.position.x < platform.x + platform.width &&
      player.position.x + player.width > platform.x &&
      player.position.y < platform.y + platform.height &&
      player.position.y + player.height > platform.y
    );
  }
}

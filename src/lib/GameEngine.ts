import { Player, Platform, InputState } from "@/types/game";

export class GameEngine {
  // Physics constants are now per-second values
  private readonly GRAVITY = 980; // pixels per second squared
  private readonly JUMP_FORCE = -600; // pixels per second
  private readonly MOVE_SPEED = 250; // pixels per second
  private readonly MAX_FALL_SPEED = 800; // pixels per second

  public updatePlayer(
    player: Player,
    input: InputState,
    platforms: Platform[],
    canvasWidth: number,
    deltaTime: number = 1 / 60 // Default to 60 FPS if not provided
  ): Player {
    const updated = { ...player };

    // Store previous position before any updates
    const prevPosition = { x: player.position.x, y: player.position.y };

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
      updated.velocity.y += this.GRAVITY * deltaTime;
      if (updated.velocity.y > this.MAX_FALL_SPEED) {
        updated.velocity.y = this.MAX_FALL_SPEED;
      }
    }

    // Update position based on velocity and delta time
    updated.position.x += updated.velocity.x * deltaTime;
    updated.position.y += updated.velocity.y * deltaTime;

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
        // Use stored previous position instead of calculating backwards
        const prevY = prevPosition.y;
        const prevX = prevPosition.x;

        // Calculate overlap amounts to determine collision direction
        const overlapLeft = updated.position.x + updated.width - platform.x;
        const overlapRight = platform.x + platform.width - updated.position.x;
        const overlapTop = updated.position.y + updated.height - platform.y;
        const overlapBottom = platform.y + platform.height - updated.position.y;

        // Find the smallest overlap to determine collision side
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        // Landing on top of platform
        if (
          minOverlap === overlapTop &&
          updated.velocity.y > 0 &&
          prevY + updated.height <= platform.y
        ) {
          updated.position.y = platform.y - updated.height;
          updated.velocity.y = 0;
          updated.isGrounded = true;
          break; // Stop processing after resolving collision
        }
        // Hitting bottom of platform
        else if (
          minOverlap === overlapBottom &&
          updated.velocity.y < 0 &&
          prevY >= platform.y + platform.height
        ) {
          updated.position.y = platform.y + platform.height;
          updated.velocity.y = 0;
          break; // Stop processing after resolving collision
        }
        // Hitting left side of platform
        else if (
          minOverlap === overlapLeft &&
          prevX + updated.width <= platform.x
        ) {
          updated.position.x = platform.x - updated.width;
          updated.velocity.x = 0;
          break; // Stop processing after resolving collision
        }
        // Hitting right side of platform
        else if (
          minOverlap === overlapRight &&
          prevX >= platform.x + platform.width
        ) {
          updated.position.x = platform.x + platform.width;
          updated.velocity.x = 0;
          break; // Stop processing after resolving collision
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

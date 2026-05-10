import { Player, Platform, InputState } from "@/types/game";
import { InputController } from "./InputController";

export class GameEngine {
  // Physics constants are now per-second values (updated to match specification)
  private readonly GRAVITY = 980; // pixels per second squared
  private readonly JUMP_FORCE = -400; // pixels per second (updated from -600 to -400)
  private readonly MOVE_SPEED = 200; // pixels per second (updated from 250 to 200)
  private readonly SPRINT_MULTIPLIER = 1.5; // Sprint speed multiplier
  private readonly MAX_FALL_SPEED = 800; // pixels per second
  private readonly COYOTE_TIME = 100; // milliseconds
  private readonly VARIABLE_JUMP_CUT = 0.5; // Cut jump velocity to 50% when released early

  public updatePlayer(
    player: Player,
    input: InputState,
    platforms: Platform[],
    canvasWidth: number,
    deltaTime: number = 1 / 60, // Default to 60 FPS if not provided
    inputController?: InputController,
    currentTime: number = performance.now()
  ): Player {
    const updated = { ...player };

    // Store previous position before any updates
    const prevPosition = { x: player.position.x, y: player.position.y };

    // Track last grounded time for coyote time
    if (updated.isGrounded) {
      updated.lastGroundedTime = currentTime;
    }

    // Determine if coyote time is active
    const coyoteTimeActive =
      !updated.isGrounded &&
      currentTime - updated.lastGroundedTime <= this.COYOTE_TIME;

    // Handle crouch state
    updated.isCrouching = input.crouch && updated.isGrounded;

    // Apply horizontal movement (disabled when crouching)
    if (!updated.isCrouching) {
      // Use last-input-wins for conflicting directional inputs
      const lastKey = inputController?.getLastDirectionalKey();
      let moveLeft = false;
      let moveRight = false;

      if (input.left && input.right) {
        // Both keys pressed - use last pressed
        moveLeft = lastKey === "left";
        moveRight = lastKey === "right";
      } else {
        moveLeft = input.left;
        moveRight = input.right;
      }

      // Calculate movement speed with sprint modifier
      let moveSpeed = this.MOVE_SPEED;
      if (input.sprint) {
        moveSpeed *= this.SPRINT_MULTIPLIER;
      }

      if (moveLeft) {
        updated.velocity.x = -moveSpeed;
        updated.isFacingRight = false;
      } else if (moveRight) {
        updated.velocity.x = moveSpeed;
        updated.isFacingRight = true;
      } else {
        updated.velocity.x = 0;
      }
    } else {
      // Stop horizontal movement when crouching
      updated.velocity.x = 0;
    }

    // Check for buffered jump (jump pressed slightly before landing)
    const hasBufferedJump = inputController?.hasBufferedJump(currentTime) ?? false;

    // Apply jump (works with grounded OR coyote time OR buffered jump)
    if ((input.jump || hasBufferedJump) && (updated.isGrounded || coyoteTimeActive)) {
      updated.velocity.y = this.JUMP_FORCE;
      updated.isGrounded = false;
      // Consume buffered jump if it was used
      if (hasBufferedJump && inputController) {
        inputController.consumeJump();
      }
    }

    // Variable jump height - cut upward velocity when jump released early
    if (input.jumpReleased && updated.velocity.y < 0) {
      updated.velocity.y *= this.VARIABLE_JUMP_CUT;
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
          updated.lastGroundedTime = currentTime;
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

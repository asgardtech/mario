import { Player, Platform, InputState } from "./types";
import { PHYSICS, PLAYER } from "./constants";

export function applyGravity(player: Player): void {
  if (!player.isGrounded) {
    player.velocity.y = Math.min(
      player.velocity.y + PHYSICS.GRAVITY,
      PLAYER.MAX_FALL_SPEED
    );
  }
}

export function handleInput(player: Player, input: InputState): void {
  if (input.left) {
    player.velocity.x = -PLAYER.SPEED;
  } else if (input.right) {
    player.velocity.x = PLAYER.SPEED;
  } else {
    player.velocity.x *= PHYSICS.FRICTION;
    if (Math.abs(player.velocity.x) < 0.1) {
      player.velocity.x = 0;
    }
  }

  if (input.jump && player.isGrounded && !player.isJumping) {
    player.velocity.y = PLAYER.JUMP_FORCE;
    player.isJumping = true;
    player.isGrounded = false;
  }

  if (!input.jump && player.isJumping && player.velocity.y < 0) {
    player.velocity.y *= 0.5;
  }
}

export function updatePosition(player: Player): void {
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}

export function checkCollisions(player: Player, platforms: Platform[], canvasWidth: number, canvasHeight: number): void {
  player.isGrounded = false;

  for (const platform of platforms) {
    if (
      player.position.x + player.width > platform.x &&
      player.position.x < platform.x + platform.width &&
      player.position.y + player.height > platform.y &&
      player.position.y < platform.y + platform.height
    ) {
      const overlapX = Math.min(
        player.position.x + player.width - platform.x,
        platform.x + platform.width - player.position.x
      );
      const overlapY = Math.min(
        player.position.y + player.height - platform.y,
        platform.y + platform.height - player.position.y
      );

      if (overlapX < overlapY) {
        if (player.position.x < platform.x) {
          player.position.x = platform.x - player.width;
        } else {
          player.position.x = platform.x + platform.width;
        }
        player.velocity.x = 0;
      } else {
        if (player.position.y < platform.y) {
          player.position.y = platform.y - player.height;
          player.velocity.y = 0;
          player.isGrounded = true;
          player.isJumping = false;
        } else {
          player.position.y = platform.y + platform.height;
          player.velocity.y = 0;
        }
      }
    }
  }

  if (player.position.y + player.height >= canvasHeight) {
    player.position.y = canvasHeight - player.height;
    player.velocity.y = 0;
    player.isGrounded = true;
    player.isJumping = false;
  }

  if (player.position.y < 0) {
    player.position.y = 0;
    player.velocity.y = 0;
  }

  if (player.position.x < 0) {
    player.position.x = 0;
    player.velocity.x = 0;
  }

  if (player.position.x + player.width > canvasWidth) {
    player.position.x = canvasWidth - player.width;
    player.velocity.x = 0;
  }
}

import { GameState, Platform, Player, Vec2, Particle } from './types';

const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const JUMP_FORCE = -12;
const MAX_FALL_SPEED = 15;
const RESPAWN_Y_THRESHOLD = 700;

export class Physics {
  private wasJumpingLastFrame = false;

  update(state: GameState, input: { left: boolean; right: boolean; jump: boolean }, deltaTime: number = 1, canvasWidth: number = 800) {
    if (!state.isPlaying) return;

    const wasOnGround = !state.player.isJumping;

    this.updatePlayer(state.player, input, deltaTime, state.tileMap.worldWidth);
    this.applyGravity(state.player, deltaTime);
    this.handleCollisions(state.player, state.platforms, state.particles);
    this.updateCamera(state.camera, state.player, canvasWidth, state.tileMap.worldWidth);
    this.updateParticles(state.particles, deltaTime);

    // Spawn landing particles
    if (!wasOnGround && !state.player.isJumping) {
      this.spawnLandingParticles(state.particles, state.player);
    }

    // Spawn jump particles
    if (input.jump && !this.wasJumpingLastFrame && !state.player.isJumping) {
      this.spawnJumpParticles(state.particles, state.player);
    }

    this.wasJumpingLastFrame = state.player.isJumping && input.jump;
  }

  private updatePlayer(player: Player, input: { left: boolean; right: boolean; jump: boolean }, deltaTime: number, worldWidth: number) {
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

    player.position.x = Math.max(0, Math.min(player.position.x, worldWidth - player.width));

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

  private handleCollisions(player: Player, platforms: Platform[], particles: Particle[]) {
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

  private updateCamera(camera: Vec2, player: Player, canvasWidth: number, worldWidth: number) {
    const targetX = player.position.x - canvasWidth / 2;
    camera.x = Math.max(0, Math.min(targetX, worldWidth - canvasWidth));
  }

  private updateParticles(particles: Particle[], deltaTime: number) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.lifetime -= deltaTime;

      if (particle.lifetime <= 0) {
        particles.splice(i, 1);
        continue;
      }

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.velocity.y += 0.2 * deltaTime; // Gravity for particles
    }
  }

  private spawnLandingParticles(particles: Particle[], player: Player) {
    const numParticles = 6;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        position: {
          x: player.position.x + player.width / 2 + (Math.random() - 0.5) * player.width,
          y: player.position.y + player.height
        },
        velocity: {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * -2 - 1
        },
        lifetime: 20 + Math.random() * 10,
        maxLifetime: 30,
        size: 2 + Math.random() * 2,
        color: '#D2B48C'
      });
    }
  }

  private spawnJumpParticles(particles: Particle[], player: Player) {
    const numParticles = 4;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        position: {
          x: player.position.x + player.width / 2 + (Math.random() - 0.5) * player.width,
          y: player.position.y + player.height
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: Math.random() * 2
        },
        lifetime: 15 + Math.random() * 10,
        maxLifetime: 25,
        size: 1.5 + Math.random() * 1.5,
        color: '#D2B48C'
      });
    }
  }
}

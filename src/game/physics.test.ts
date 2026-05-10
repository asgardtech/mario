import { describe, it, expect } from "vitest";
import { applyGravity, handleInput, updatePosition, checkCollisions } from "./physics";
import { Player, InputState, Platform } from "./types";
import { PLAYER, PHYSICS } from "./constants";

describe("Physics", () => {
  describe("applyGravity", () => {
    it("should apply gravity when player is not grounded", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: true,
        isGrounded: false,
      };

      applyGravity(player);
      expect(player.velocity.y).toBe(PHYSICS.GRAVITY);
    });

    it("should not apply gravity when player is grounded", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: true,
      };

      applyGravity(player);
      expect(player.velocity.y).toBe(0);
    });

    it("should cap falling speed at max fall speed", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 20 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: false,
      };

      applyGravity(player);
      expect(player.velocity.y).toBe(PLAYER.MAX_FALL_SPEED);
    });
  });

  describe("handleInput", () => {
    it("should move player left when left input is pressed", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: true,
      };

      const input: InputState = { left: true, right: false, jump: false };
      handleInput(player, input);
      expect(player.velocity.x).toBe(-PLAYER.SPEED);
    });

    it("should move player right when right input is pressed", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: true,
      };

      const input: InputState = { left: false, right: true, jump: false };
      handleInput(player, input);
      expect(player.velocity.x).toBe(PLAYER.SPEED);
    });

    it("should make player jump when jump input is pressed and grounded", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: true,
      };

      const input: InputState = { left: false, right: false, jump: true };
      handleInput(player, input);
      expect(player.velocity.y).toBe(PLAYER.JUMP_FORCE);
      expect(player.isJumping).toBe(true);
      expect(player.isGrounded).toBe(false);
    });

    it("should apply friction when no horizontal input", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 0 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: false,
        isGrounded: true,
      };

      const input: InputState = { left: false, right: false, jump: false };
      handleInput(player, input);
      expect(player.velocity.x).toBe(5 * PHYSICS.FRICTION);
    });
  });

  describe("updatePosition", () => {
    it("should update player position based on velocity", () => {
      const player: Player = {
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: -10 },
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        isJumping: true,
        isGrounded: false,
      };

      updatePosition(player);
      expect(player.position.x).toBe(105);
      expect(player.position.y).toBe(90);
    });
  });

  describe("checkCollisions", () => {
    const canvasWidth = 800;
    const canvasHeight = 600;

    describe("platform collisions", () => {
      it("should detect landing on platform from above", () => {
        const player: Player = {
          position: { x: 200, y: 280 },
          velocity: { x: 0, y: 5 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: true,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 150, y: 300, width: 200, height: 20 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.position.y).toBe(300 - PLAYER.HEIGHT);
        expect(player.velocity.y).toBe(0);
        expect(player.isGrounded).toBe(true);
        expect(player.isJumping).toBe(false);
      });

      it("should detect hitting platform from below", () => {
        const player: Player = {
          position: { x: 200, y: 215 },
          velocity: { x: 0, y: -5 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: true,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 150, y: 200, width: 200, height: 20 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.position.y).toBe(220);
        expect(player.velocity.y).toBe(0);
        expect(player.isGrounded).toBe(false);
      });

      it("should detect collision from the left side", () => {
        const player: Player = {
          position: { x: 195, y: 250 },
          velocity: { x: 5, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 200, y: 200, width: 100, height: 100 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.position.x).toBe(200 - PLAYER.WIDTH);
        expect(player.velocity.x).toBe(0);
      });

      it("should detect collision from the right side", () => {
        const player: Player = {
          position: { x: 295, y: 250 },
          velocity: { x: -5, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 200, y: 200, width: 100, height: 100 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.position.x).toBe(300);
        expect(player.velocity.x).toBe(0);
      });

      it("should handle multiple platform collisions", () => {
        const player: Player = {
          position: { x: 200, y: 280 },
          velocity: { x: 0, y: 5 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: true,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 150, y: 300, width: 200, height: 20 },
          { x: 400, y: 300, width: 200, height: 20 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.isGrounded).toBe(true);
        expect(player.velocity.y).toBe(0);
      });
    });

    describe("canvas boundary collisions", () => {
      it("should stop player at bottom boundary", () => {
        const player: Player = {
          position: { x: 100, y: 595 },
          velocity: { x: 0, y: 10 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: false,
        };

        checkCollisions(player, [], canvasWidth, canvasHeight);

        expect(player.position.y).toBe(canvasHeight - PLAYER.HEIGHT);
        expect(player.velocity.y).toBe(0);
        expect(player.isGrounded).toBe(true);
        expect(player.isJumping).toBe(false);
      });

      it("should stop player at top boundary", () => {
        const player: Player = {
          position: { x: 100, y: -5 },
          velocity: { x: 0, y: -10 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: true,
          isGrounded: false,
        };

        checkCollisions(player, [], canvasWidth, canvasHeight);

        expect(player.position.y).toBe(0);
        expect(player.velocity.y).toBe(0);
      });

      it("should stop player at left boundary", () => {
        const player: Player = {
          position: { x: -5, y: 100 },
          velocity: { x: -5, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: false,
        };

        checkCollisions(player, [], canvasWidth, canvasHeight);

        expect(player.position.x).toBe(0);
        expect(player.velocity.x).toBe(0);
      });

      it("should stop player at right boundary", () => {
        const player: Player = {
          position: { x: 795, y: 100 },
          velocity: { x: 5, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: false,
        };

        checkCollisions(player, [], canvasWidth, canvasHeight);

        expect(player.position.x).toBe(canvasWidth - PLAYER.WIDTH);
        expect(player.velocity.x).toBe(0);
      });
    });

    describe("edge cases", () => {
      it("should handle player exactly at boundary", () => {
        const player: Player = {
          position: { x: 0, y: canvasHeight - PLAYER.HEIGHT },
          velocity: { x: 0, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: true,
        };

        checkCollisions(player, [], canvasWidth, canvasHeight);

        expect(player.position.x).toBe(0);
        expect(player.position.y).toBe(canvasHeight - PLAYER.HEIGHT);
      });

      it("should reset grounded state when not on platform", () => {
        const player: Player = {
          position: { x: 100, y: 100 },
          velocity: { x: 0, y: 0 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: false,
          isGrounded: true,
        };

        const platforms: Platform[] = [
          { x: 400, y: 300, width: 200, height: 20 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.isGrounded).toBe(false);
      });

      it("should handle collision with platform at canvas corner", () => {
        const player: Player = {
          position: { x: 5, y: 90 },
          velocity: { x: -2, y: 5 },
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          isJumping: true,
          isGrounded: false,
        };

        const platforms: Platform[] = [
          { x: 0, y: 100, width: 100, height: 20 },
        ];

        checkCollisions(player, platforms, canvasWidth, canvasHeight);

        expect(player.position.y).toBe(100 - PLAYER.HEIGHT);
        expect(player.isGrounded).toBe(true);
      });
    });
  });
});

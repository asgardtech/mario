import { describe, it, expect } from "vitest";
import { applyGravity, handleInput, updatePosition } from "./physics";
import { Player, InputState } from "./types";
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
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Renderer } from "./renderer";
import { GameState, Player, Level } from "./types";
import { PLAYER } from "./constants";

describe("Renderer", () => {
  let mockCtx: CanvasRenderingContext2D;
  let renderer: Renderer;
  let gameState: GameState;

  beforeEach(() => {
    mockCtx = {
      fillStyle: "",
      fillRect: vi.fn(),
      fillText: vi.fn(),
      font: "",
    } as unknown as CanvasRenderingContext2D;

    renderer = new Renderer(mockCtx);

    const player: Player = {
      position: { x: 100, y: 200 },
      velocity: { x: 0, y: 0 },
      width: PLAYER.WIDTH,
      height: PLAYER.HEIGHT,
      isJumping: false,
      isGrounded: true,
    };

    const level: Level = {
      platforms: [
        { x: 50, y: 300, width: 200, height: 20 },
        { x: 300, y: 400, width: 150, height: 20 },
      ],
    };

    gameState = {
      player,
      level,
      score: 42,
      isRunning: true,
    };
  });

  describe("clear", () => {
    it("should clear canvas with sky blue background", () => {
      const width = 800;
      const height = 600;

      renderer.clear(width, height);

      expect(mockCtx.fillStyle).toBe("#87CEEB");
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    it("should handle different canvas dimensions", () => {
      const width = 1024;
      const height = 768;

      renderer.clear(width, height);

      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
    });
  });

  describe("render", () => {
    it("should render all platforms with brown color", () => {
      const fillStyleSpy: string[] = [];
      Object.defineProperty(mockCtx, "fillStyle", {
        set: (value: string) => fillStyleSpy.push(value),
        get: () => fillStyleSpy[fillStyleSpy.length - 1] || "",
      });

      renderer.render(gameState);

      expect(fillStyleSpy).toContain("#8B4513");
      expect(mockCtx.fillRect).toHaveBeenCalledWith(50, 300, 200, 20);
      expect(mockCtx.fillRect).toHaveBeenCalledWith(300, 400, 150, 20);
    });

    it("should render player with red color", () => {
      const fillStyleSpy: string[] = [];
      Object.defineProperty(mockCtx, "fillStyle", {
        set: (value: string) => fillStyleSpy.push(value),
        get: () => fillStyleSpy[fillStyleSpy.length - 1] || "",
      });

      renderer.render(gameState);

      expect(fillStyleSpy).toContain("#FF0000");
      expect(mockCtx.fillRect).toHaveBeenCalledWith(
        100,
        200,
        PLAYER.WIDTH,
        PLAYER.HEIGHT
      );
    });

    it("should render score in black with correct font", () => {
      renderer.render(gameState);

      expect(mockCtx.fillStyle).toContain("#000000");
      expect(mockCtx.font).toBe("20px Arial");
      expect(mockCtx.fillText).toHaveBeenCalledWith("Score: 42", 10, 30);
    });

    it("should render all elements in correct order", () => {
      const fillRectCalls = (mockCtx.fillRect as any).mock.calls;

      renderer.render(gameState);

      expect(fillRectCalls[0]).toEqual([50, 300, 200, 20]);
      expect(fillRectCalls[1]).toEqual([300, 400, 150, 20]);
      expect(fillRectCalls[2]).toEqual([100, 200, PLAYER.WIDTH, PLAYER.HEIGHT]);
    });

    it("should handle empty platforms array", () => {
      gameState.level.platforms = [];

      renderer.render(gameState);

      expect(mockCtx.fillRect).toHaveBeenCalledWith(
        100,
        200,
        PLAYER.WIDTH,
        PLAYER.HEIGHT
      );
    });

    it("should render score of 0 correctly", () => {
      gameState.score = 0;

      renderer.render(gameState);

      expect(mockCtx.fillText).toHaveBeenCalledWith("Score: 0", 10, 30);
    });

    it("should render large scores correctly", () => {
      gameState.score = 999999;

      renderer.render(gameState);

      expect(mockCtx.fillText).toHaveBeenCalledWith("Score: 999999", 10, 30);
    });

    it("should render player at different positions", () => {
      gameState.player.position = { x: 500, y: 100 };

      renderer.render(gameState);

      expect(mockCtx.fillRect).toHaveBeenCalledWith(
        500,
        100,
        PLAYER.WIDTH,
        PLAYER.HEIGHT
      );
    });
  });
});

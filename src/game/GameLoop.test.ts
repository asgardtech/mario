import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { GameLoop } from "./GameLoop";
import { InputHandler } from "./input";
import { Renderer } from "./renderer";
import { createInitialState } from "./createInitialState";
import { CANVAS_WIDTH, CANVAS_HEIGHT, FRAME_TIME } from "./constants";

describe("GameLoop", () => {
  let gameLoop: GameLoop;
  let mockCtx: CanvasRenderingContext2D;
  let inputHandler: InputHandler;
  let renderer: Renderer;

  beforeEach(() => {
    vi.useFakeTimers();

    mockCtx = {
      fillStyle: "",
      fillRect: vi.fn(),
      fillText: vi.fn(),
      font: "",
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    inputHandler = new InputHandler();
    renderer = new Renderer(mockCtx);

    const initialState = createInitialState();
    gameLoop = new GameLoop(
      initialState,
      inputHandler,
      renderer,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
  });

  afterEach(() => {
    gameLoop.stop();
    vi.useRealTimers();
  });

  it("should initialize with correct state", () => {
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
    expect(state.score).toBe(0);
    expect(state.player).toBeDefined();
    expect(state.level).toBeDefined();
  });

  it("should start the game loop", () => {
    gameLoop.start();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(true);
  });

  it("should stop the game loop", () => {
    gameLoop.start();
    gameLoop.stop();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
  });

  it("should not start if already running", () => {
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");
    gameLoop.start();
    gameLoop.start();
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    gameLoop.stop();
  });

  it("should have player with initial position", () => {
    const state = gameLoop.getState();
    expect(state.player.position.x).toBe(100);
    expect(state.player.position.y).toBe(100);
  });

  it("should have platforms in the level", () => {
    const state = gameLoop.getState();
    expect(state.level.platforms.length).toBeGreaterThan(0);
  });

  describe("game loop execution", () => {
    it("should call render on each animation frame", () => {
      const renderSpy = vi.spyOn(renderer, "render");
      const clearSpy = vi.spyOn(renderer, "clear");

      gameLoop.start();

      vi.advanceTimersByTime(FRAME_TIME);

      expect(clearSpy).toHaveBeenCalled();
      expect(renderSpy).toHaveBeenCalled();
    });

    it("should update game state during the loop", () => {
      const state = gameLoop.getState();
      const initialY = state.player.position.y;

      state.player.velocity.y = 5;
      state.player.isGrounded = false;

      gameLoop.start();
      vi.advanceTimersByTime(FRAME_TIME * 2);

      expect(state.player.position.y).not.toBe(initialY);
    });

    it("should use fixed timestep accumulator", () => {
      const renderSpy = vi.spyOn(renderer, "render");

      gameLoop.start();

      vi.advanceTimersByTime(FRAME_TIME / 2);
      const renderCallsHalf = renderSpy.mock.calls.length;

      vi.advanceTimersByTime(FRAME_TIME / 2);
      const renderCallsFull = renderSpy.mock.calls.length;

      expect(renderCallsFull).toBeGreaterThan(renderCallsHalf);
    });


    it("should stop updating when stopped", () => {
      const renderSpy = vi.spyOn(renderer, "render");

      gameLoop.start();
      vi.advanceTimersByTime(FRAME_TIME);
      const callsWhileRunning = renderSpy.mock.calls.length;

      gameLoop.stop();
      renderSpy.mockClear();

      vi.advanceTimersByTime(FRAME_TIME * 10);
      const callsAfterStopping = renderSpy.mock.calls.length;

      expect(callsWhileRunning).toBeGreaterThan(0);
      expect(callsAfterStopping).toBe(0);
    });
  });
});

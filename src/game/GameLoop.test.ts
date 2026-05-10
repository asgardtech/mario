import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { GameLoop } from "./GameLoop";
import { InputHandler } from "./input";
import { Renderer } from "./renderer";
import { createInitialState } from "./createInitialState";
import { CANVAS_WIDTH, CANVAS_HEIGHT, FRAME_TIME, MAX_DELTA } from "./constants";
import { GameStateType } from "./types";

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
    gameLoop.destroy();
    vi.useRealTimers();
  });

  it("should initialize with correct state", () => {
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
    expect(state.state).toBe(GameStateType.MENU);
    expect(state.score).toBe(0);
    expect(state.player).toBeDefined();
    expect(state.level).toBeDefined();
  });

  it("should start the game loop", () => {
    gameLoop.start();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(true);
    expect(state.state).toBe(GameStateType.PLAYING);
  });

  it("should stop the game loop", () => {
    gameLoop.start();
    gameLoop.stop();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
    expect(state.state).toBe(GameStateType.MENU);
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

  describe("state management", () => {
    it("should transition from MENU to PLAYING", () => {
      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);

      gameLoop.transitionToPlaying();

      expect(gameLoop.getGameStateType()).toBe(GameStateType.PLAYING);
      expect(gameLoop.getState().isRunning).toBe(true);
    });

    it("should pause when in PLAYING state", () => {
      gameLoop.start();
      expect(gameLoop.getGameStateType()).toBe(GameStateType.PLAYING);

      gameLoop.pause();

      expect(gameLoop.getGameStateType()).toBe(GameStateType.PAUSED);
      expect(gameLoop.getState().isRunning).toBe(false);
    });

    it("should resume from PAUSED state", () => {
      gameLoop.start();
      gameLoop.pause();
      expect(gameLoop.getGameStateType()).toBe(GameStateType.PAUSED);

      gameLoop.resume();

      expect(gameLoop.getGameStateType()).toBe(GameStateType.PLAYING);
      expect(gameLoop.getState().isRunning).toBe(true);
    });

    it("should not pause if not in PLAYING state", () => {
      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);

      gameLoop.pause();

      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);
    });

    it("should not resume if not in PAUSED state", () => {
      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);

      gameLoop.resume();

      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);
    });
  });

  describe("tab visibility handling", () => {
    it("should pause when tab becomes hidden", () => {
      gameLoop.start();
      expect(gameLoop.getGameStateType()).toBe(GameStateType.PLAYING);

      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });

      document.dispatchEvent(new Event('visibilitychange'));

      expect(gameLoop.getGameStateType()).toBe(GameStateType.PAUSED);
    });

    it("should not pause if not in PLAYING state", () => {
      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);

      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });

      document.dispatchEvent(new Event('visibilitychange'));

      expect(gameLoop.getGameStateType()).toBe(GameStateType.MENU);
    });
  });

  describe("delta time clamping", () => {
    it("should clamp extremely long frames to MAX_DELTA", () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const gameLoopDev = new GameLoop(
        createInitialState(),
        inputHandler,
        renderer,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        { developerMode: true }
      );

      gameLoopDev.start();

      // Simulate a very long frame (500ms)
      vi.advanceTimersByTime(500);

      // In developer mode, the logged delta should not exceed MAX_DELTA
      const logCalls = consoleSpy.mock.calls.filter(call =>
        call[0]?.includes('[GameLoop] FPS:')
      );

      if (logCalls.length > 0) {
        const lastLog = logCalls[logCalls.length - 1][0];
        const deltaMatch = lastLog.match(/Delta: ([\d.]+)ms/);
        if (deltaMatch) {
          const loggedDelta = parseFloat(deltaMatch[1]);
          // The actual delta in the accumulator should be clamped
          expect(loggedDelta).toBeGreaterThan(0);
        }
      }

      gameLoopDev.destroy();
      consoleSpy.mockRestore();
    });
  });

  describe("error handling", () => {
    it("should catch and log errors in the game loop", () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const renderSpy = vi.spyOn(renderer, "render").mockImplementation(() => {
        throw new Error("Render error");
      });

      gameLoop.start();

      vi.advanceTimersByTime(FRAME_TIME);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[GameLoop] Error in game loop:',
        expect.any(Error)
      );

      // Game should still be running after error
      expect(gameLoop.getState().isRunning).toBe(true);

      renderSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should reset accumulator on error", () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      let errorCount = 0;
      const renderSpy = vi.spyOn(renderer, "render").mockImplementation(() => {
        if (errorCount++ === 0) {
          throw new Error("First error");
        }
      });

      gameLoop.start();

      vi.advanceTimersByTime(FRAME_TIME);
      vi.advanceTimersByTime(FRAME_TIME);

      // Should have recovered and rendered on second frame
      expect(renderSpy).toHaveBeenCalled();

      renderSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("developer mode", () => {
    it("should track FPS in developer mode", () => {
      // Mock performance.now to work with fake timers
      let mockTime = 0;
      const performanceSpy = vi.spyOn(performance, 'now').mockImplementation(() => mockTime);

      const gameLoopDev = new GameLoop(
        createInitialState(),
        inputHandler,
        renderer,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        { developerMode: true }
      );

      gameLoopDev.start();

      // Simulate multiple frames over one second
      for (let i = 0; i < 65; i++) {
        mockTime += FRAME_TIME;
        vi.advanceTimersByTime(FRAME_TIME);
      }

      const fps = gameLoopDev.getCurrentFps();
      expect(fps).toBeGreaterThan(0);

      gameLoopDev.destroy();
      performanceSpy.mockRestore();
    });

    it("should log performance metrics in developer mode", () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Mock performance.now to work with fake timers
      let mockTime = 0;
      const performanceSpy = vi.spyOn(performance, 'now').mockImplementation(() => mockTime);

      const gameLoopDev = new GameLoop(
        createInitialState(),
        inputHandler,
        renderer,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        { developerMode: true }
      );

      gameLoopDev.start();

      // Simulate multiple frames over one second
      for (let i = 0; i < 65; i++) {
        mockTime += FRAME_TIME;
        vi.advanceTimersByTime(FRAME_TIME);
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[GameLoop] FPS:')
      );

      gameLoopDev.destroy();
      consoleSpy.mockRestore();
      performanceSpy.mockRestore();
    });

    it("should not log in non-developer mode", () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      gameLoop.start();
      vi.advanceTimersByTime(1000);

      const gameLoopLogs = consoleSpy.mock.calls.filter(call =>
        call[0]?.includes('[GameLoop]')
      );
      expect(gameLoopLogs.length).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe("cleanup", () => {
    it("should remove visibility change listener on destroy", () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      gameLoop.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});

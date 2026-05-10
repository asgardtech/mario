import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InputHandler } from "./input";

describe("InputHandler", () => {
  let inputHandler: InputHandler;

  beforeEach(() => {
    inputHandler = new InputHandler();
    inputHandler.attach();
  });

  afterEach(() => {
    inputHandler.detach();
  });

  it("should initialize with no keys pressed", () => {
    const state = inputHandler.getInputState();
    expect(state.left).toBe(false);
    expect(state.right).toBe(false);
    expect(state.jump).toBe(false);
  });

  it("should detect left arrow key press", () => {
    const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    window.dispatchEvent(event);

    const state = inputHandler.getInputState();
    expect(state.left).toBe(true);
  });

  it("should detect right arrow key press", () => {
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    window.dispatchEvent(event);

    const state = inputHandler.getInputState();
    expect(state.right).toBe(true);
  });

  it("should detect jump key press (space)", () => {
    const event = new KeyboardEvent("keydown", { key: " " });
    window.dispatchEvent(event);

    const state = inputHandler.getInputState();
    expect(state.jump).toBe(true);
  });

  it("should detect WASD keys", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    let state = inputHandler.getInputState();
    expect(state.left).toBe(true);

    inputHandler.reset();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    state = inputHandler.getInputState();
    expect(state.right).toBe(true);

    inputHandler.reset();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
    state = inputHandler.getInputState();
    expect(state.jump).toBe(true);
  });

  it("should clear keys on keyup", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    let state = inputHandler.getInputState();
    expect(state.left).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowLeft" }));
    state = inputHandler.getInputState();
    expect(state.left).toBe(false);
  });

  it("should reset all keys", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    inputHandler.reset();

    const state = inputHandler.getInputState();
    expect(state.left).toBe(false);
    expect(state.right).toBe(false);
    expect(state.jump).toBe(false);
  });
});

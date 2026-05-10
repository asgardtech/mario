import { InputState } from "@/types/game";

export class InputController {
  private keys: InputState = {
    left: false,
    right: false,
    jump: false,
    sprint: false,
    crouch: false,
    jumpReleased: false,
  };
  private jumpPressed = false;
  private lastDirectionalKey: "left" | "right" | null = null;
  private jumpBufferTime: number = 0;
  private readonly JUMP_BUFFER_WINDOW = 100; // 100ms buffer window

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public attach(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleBlur);
  }

  public detach(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleBlur);
  }

  private handleBlur(): void {
    // Clear all input state when window loses focus to prevent stuck keys
    this.keys.left = false;
    this.keys.right = false;
    this.keys.jump = false;
    this.keys.sprint = false;
    this.keys.crouch = false;
    this.keys.jumpReleased = false;
    this.jumpPressed = false;
    this.lastDirectionalKey = null;
    this.jumpBufferTime = 0;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = true;
        this.lastDirectionalKey = "left";
        event.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = true;
        this.lastDirectionalKey = "right";
        event.preventDefault();
        break;
      case "ArrowDown":
      case "KeyS":
        this.keys.crouch = true;
        event.preventDefault();
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.sprint = true;
        event.preventDefault();
        break;
      case "Space":
      case "KeyW":
      case "ArrowUp":
        // Only register jump if key wasn't already pressed (prevents holding)
        if (!this.jumpPressed) {
          this.keys.jump = true;
          this.jumpPressed = true;
          this.keys.jumpReleased = false;
          this.jumpBufferTime = performance.now();
        }
        event.preventDefault();
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = false;
        if (this.lastDirectionalKey === "left") {
          this.lastDirectionalKey = null;
        }
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = false;
        if (this.lastDirectionalKey === "right") {
          this.lastDirectionalKey = null;
        }
        break;
      case "ArrowDown":
      case "KeyS":
        this.keys.crouch = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.sprint = false;
        break;
      case "Space":
      case "KeyW":
      case "ArrowUp":
        this.keys.jump = false;
        this.jumpPressed = false;
        this.keys.jumpReleased = true;
        break;
    }
  }

  public getInputState(): InputState {
    return { ...this.keys };
  }

  public consumeJump(): void {
    this.keys.jump = false;
    this.jumpBufferTime = 0;
  }

  public hasBufferedJump(currentTime: number): boolean {
    if (this.jumpBufferTime === 0) return false;
    return currentTime - this.jumpBufferTime <= this.JUMP_BUFFER_WINDOW;
  }

  public getLastDirectionalKey(): "left" | "right" | null {
    return this.lastDirectionalKey;
  }
}

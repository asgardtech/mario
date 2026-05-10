import { InputState } from "@/types/game";

export class InputController {
  private keys: InputState = {
    left: false,
    right: false,
    jump: false,
  };

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public attach(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public detach(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = true;
        event.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = true;
        event.preventDefault();
        break;
      case "Space":
      case "KeyW":
      case "ArrowUp":
        this.keys.jump = true;
        event.preventDefault();
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = false;
        break;
      case "Space":
      case "KeyW":
      case "ArrowUp":
        this.keys.jump = false;
        break;
    }
  }

  public getInputState(): InputState {
    return { ...this.keys };
  }
}

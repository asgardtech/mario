import { InputState } from "./types";

export class InputHandler {
  private keys: Set<string> = new Set();

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
      event.preventDefault();
    }
    this.keys.add(event.key);
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keys.delete(event.key);
  }

  public attach() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public detach() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  public getInputState(): InputState {
    return {
      left: this.keys.has("ArrowLeft") || this.keys.has("a") || this.keys.has("A"),
      right: this.keys.has("ArrowRight") || this.keys.has("d") || this.keys.has("D"),
      jump: this.keys.has("ArrowUp") || this.keys.has(" ") || this.keys.has("w") || this.keys.has("W"),
    };
  }

  public reset() {
    this.keys.clear();
  }
}

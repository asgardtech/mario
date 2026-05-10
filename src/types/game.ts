export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  isGrounded: boolean;
  isFacingRight: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

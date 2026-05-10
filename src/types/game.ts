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
  isCrouching: boolean;
  lastGroundedTime: number;
  jumpCutApplied: boolean; // Track if variable jump cut has been applied for current jump
  jumpedThisFrame: boolean; // Track if a jump was performed this frame
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
  sprint: boolean;
  crouch: boolean;
  jumpReleased: boolean;
}

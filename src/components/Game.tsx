import { useEffect, useRef, useState } from "react";
import { Player, Platform } from "@/types/game";
import { InputController } from "@/lib/InputController";
import { GameEngine } from "@/lib/GameEngine";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const inputController = new InputController();
    const gameEngine = new GameEngine();

    // Initialize player
    let player: Player = {
      position: { x: 100, y: 100 },
      velocity: { x: 0, y: 0 },
      width: 32,
      height: 48,
      normalHeight: 48,
      isGrounded: false,
      isFacingRight: true,
      isCrouching: false,
      lastGroundedTime: performance.now(),
      jumpCutApplied: false,
      jumpedThisFrame: false,
    };

    // Create platforms
    const platforms: Platform[] = [
      // Ground
      { x: 0, y: 550, width: 800, height: 50 },
      // Floating platforms
      { x: 150, y: 450, width: 150, height: 20 },
      { x: 400, y: 350, width: 150, height: 20 },
      { x: 600, y: 250, width: 150, height: 20 },
      { x: 300, y: 150, width: 200, height: 20 },
    ];

    inputController.attach();

    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      // Calculate delta time in seconds
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 0.1s to prevent huge jumps
      lastTime = currentTime;

      // Update
      const input = inputController.getInputState();

      player = gameEngine.updatePlayer(
        player,
        input,
        platforms,
        CANVAS_WIDTH,
        deltaTime,
        inputController,
        currentTime
      );

      // Consume jump input after processing if a jump was actually performed
      // This works for regular jumps, coyote time jumps, and buffered jumps
      if (input.jump && player.jumpedThisFrame) {
        inputController.consumeJump();
      }

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw platforms
      ctx.fillStyle = "#8B4513";
      platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add grass on top
        ctx.fillStyle = "#228B22";
        ctx.fillRect(platform.x, platform.y - 5, platform.width, 5);
        ctx.fillStyle = "#8B4513";
      });

      // Draw player (height now matches collision box)
      ctx.fillStyle = player.isGrounded ? "#FF0000" : "#FF6666";
      ctx.fillRect(player.position.x, player.position.y, player.width, player.height);

      // Draw player face
      ctx.fillStyle = "#000000";
      const eyeY = player.position.y + 15;
      if (player.isFacingRight) {
        // Eyes
        ctx.fillRect(player.position.x + 18, eyeY, 4, 4);
        ctx.fillRect(player.position.x + 26, eyeY, 4, 4);
      } else {
        // Eyes
        ctx.fillRect(player.position.x + 2, eyeY, 4, 4);
        ctx.fillRect(player.position.x + 10, eyeY, 4, 4);
      }

      // Draw controls info
      ctx.fillStyle = "#000000";
      ctx.font = "14px monospace";
      ctx.fillText("Controls: Arrow Keys/WASD to move, Space to jump", 10, 20);
      ctx.fillText("Shift to sprint, Down/S to crouch", 10, 40);
      ctx.fillText(
        `Position: (${Math.floor(player.position.x)}, ${Math.floor(player.position.y)})`,
        10,
        60
      );
      ctx.fillText(
        `Grounded: ${player.isGrounded} | Crouching: ${player.isCrouching}`,
        10,
        80
      );

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      inputController.detach();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Mario Game</h1>

      {!isPlaying ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">
            Press Start to begin playing!
          </p>
          <button
            onClick={() => setIsPlaying(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-gray-800 rounded-lg shadow-xl"
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
          >
            Stop Game
          </button>
        </div>
      )}
    </div>
  );
}

import { Route, Routes } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { GameStats } from "@/components/GameStats";
import { GameControls } from "@/components/GameControls";

function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-sky-400 to-sky-600">
      <GameStats />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          MARIO
        </h1>
        <p className="text-white text-lg max-w-prose text-center drop-shadow">
          A Mario-like platformer game
        </p>
        <div className="bg-white/90 rounded-lg shadow-2xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Game State Management</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Core game state system with player management, scoring, lives, and level progression.
          </p>
          <GameControls />
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold mb-2">Features Implemented:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              <li>Complete game state management with TypeScript types</li>
              <li>Player state (position, velocity, power-ups, invincibility)</li>
              <li>Score, coins, lives, and time tracking</li>
              <li>Game status management (idle, playing, paused, game over)</li>
              <li>Level progression and enemy/collectible management</li>
              <li>Game loop with time updates</li>
              <li>Keyboard input handling hook</li>
              <li>Action dispatchers for all game events</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </GameProvider>
  );
}

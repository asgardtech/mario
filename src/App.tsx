import { Route, Routes } from "react-router-dom";
import { Game } from "@/components/Game";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <Game />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";
import { Game } from "@/components/Game";

function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8">
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

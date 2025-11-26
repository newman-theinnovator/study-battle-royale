// src/App.tsx   ← THIS IS YOUR ONE AND ONLY App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./lib/firebase";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import Lobby from "./pages/Lobby";
import Arena from "./pages/Arena";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/lobby" element={user ? <Lobby /> : <Navigate to="/" />} />
      <Route path="/arena/:roomId" element={user ? <Arena /> : <Navigate to="/" />} />
<Route path="/arena/demo-room-123" element={user ? <Arena /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
import { useState } from "react";
import { useDarkMode } from "./hooks/useDarkMode";
import { LoginScreen } from "./components/auth/LoginScreen";
import { AdminPanel } from "./panels/AdminPanel";
import { AgentPanel } from "./panels/AgentPanel";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [dark, setDark] = useDarkMode();

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  if (currentUser.role === "admin") {
    return (
      <AdminPanel
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
      />
    );
  }

  return (
    <AgentPanel
      user={currentUser}
      onLogout={() => setCurrentUser(null)}
      dark={dark}
      onToggleDark={() => setDark(d => !d)}
    />
  );
}

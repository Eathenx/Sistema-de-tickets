import { useState } from "react";
import { Bell, Search, X, Sun, Moon, HelpCircle } from "lucide-react";

const VIEW_TITLES = {
  dashboard: "Dashboard",
  tickets:   "Gestión de Tickets",
  users:     "Usuarios",
  agents:    "Agentes",
  reports:   "Reportes",
  config:    "Configuración — Categorías e incidentes",
};

export function Topbar({ activeView, search, onSearch, dark, onToggleDark, user }) {
  const [hasNotif, setHasNotif] = useState(true);
  return (
    <header className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-5 gap-3 flex-shrink-0">
      <span className="text-sm font-bold text-white flex-1 uppercase tracking-widest">
        {VIEW_TITLES[activeView] ?? activeView}
      </span>

      <div className="flex items-center gap-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 h-8">
        <Search size={13} className="text-[#666]" />
        <input
          type="text" placeholder="Buscar tickets..."
          value={search} onChange={e => onSearch(e.target.value)}
          className="bg-transparent text-sm text-white outline-none w-44 placeholder:text-[#555]"
        />
        {search && (
          <button onClick={() => onSearch("")} className="text-[#666] hover:text-white">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg border border-[#3a3a3a] flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors"
          title={dark ? "Modo claro" : "Modo oscuro"}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          onClick={() => setHasNotif(false)}
          className="relative w-8 h-8 rounded-lg border border-[#3a3a3a] flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors"
        >
          <Bell size={15} />
          {hasNotif && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
        </button>
        <button className="w-8 h-8 rounded-lg border border-[#3a3a3a] flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors">
          <HelpCircle size={15} />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#16a34a] flex items-center justify-center text-[10px] font-bold text-white cursor-pointer">
          {user?.initials ?? "?"}
        </div>
      </div>
    </header>
  );
}

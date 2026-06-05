import { Ticket, LogOut } from "lucide-react";
import { NavItem } from "./NavItem";

export function Sidebar({ activeView, onNavigate, pendingCount, user, onLogout, navItems }) {
  const mainItems  = navItems.slice(0, 2);
  const extraItems = navItems.slice(2);
  return (
    <aside className="w-56 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col flex-shrink-0">
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[#2a2a2a]">
        <div className="w-7 h-7 rounded-lg bg-[#16a34a] flex items-center justify-center">
          <Ticket size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight uppercase">Sistema Tickets</span>
      </div>

      <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest px-2 py-2">Principal</p>
        {mainItems.map(({ key, label, Icon, hasBadge }) => (
          <NavItem
            key={key} label={label} Icon={Icon}
            active={activeView === key}
            badge={hasBadge ? pendingCount : null}
            onClick={() => onNavigate(key)}
          />
        ))}
        {extraItems.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest px-2 py-2 mt-1">Gestión</p>
            {extraItems.map(({ key, label, Icon }) => (
              <NavItem
                key={key} label={label} Icon={Icon}
                active={activeView === key}
                onClick={() => onNavigate(key)}
              />
            ))}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#16a34a] flex items-center justify-center text-[10px] font-bold text-white">
            {user?.initials ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">{user?.name ?? ""}</p>
            <p className="text-[10px] text-[#888] truncate">{user?.email ?? ""}</p>
          </div>
          <button onClick={onLogout} className="text-[#555] hover:text-white transition-colors" title="Cerrar sesión">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ children, activeView, onNavigate, search, onSearch, pendingCount, dark, onToggleDark, user, onLogout, navItems }) {
  return (
    <div className="flex h-screen bg-[#ece6dd] dark:bg-[#0f0f0f] font-sans">
      <Sidebar
        activeView={activeView} onNavigate={onNavigate}
        pendingCount={pendingCount} user={user}
        onLogout={onLogout} navItems={navItems}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          activeView={activeView} search={search} onSearch={onSearch}
          dark={dark} onToggleDark={onToggleDark} user={user}
        />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { LayoutDashboard, Ticket, Users, BarChart3, Settings } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { TicketDetail } from "../components/tickets/TicketDetail";
import { DashboardView } from "../views/DashboardView";
import { TicketsView } from "../views/TicketsView";
import { PlaceholderView } from "../views/PlaceholderView";
import { useTickets } from "../hooks/useTickets";
import { useAgents } from "../hooks/useAgents";

const ADMIN_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",     Icon: LayoutDashboard },
  { key: "tickets",   label: "Tickets",       Icon: Ticket, hasBadge: true },
  { key: "users",     label: "Usuarios",      Icon: Users },
  { key: "reports",   label: "Reportes",      Icon: BarChart3 },
  { key: "config",    label: "Configuración", Icon: Settings },
];

export function AdminPanel({ user, onLogout, dark, onToggleDark }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const agents = useAgents();
  const { tickets, filteredTickets, filter, setFilter, search, setSearch, updateTicket, stats, loading, error, refresh } = useTickets();

  const handleSearch = q => {
    setSearch(q);
    if (q && activeView !== "tickets") setActiveView("tickets");
  };

  const selectedTicket = tickets.find(t => t.id === selectedId) ?? null;

  return (
    <AppLayout
      activeView={activeView} onNavigate={setActiveView}
      search={search} onSearch={handleSearch}
      pendingCount={stats.pending} dark={dark} onToggleDark={onToggleDark}
      user={user} onLogout={onLogout} navItems={ADMIN_NAV_ITEMS}
    >
      {activeView === "dashboard" && (
        <DashboardView stats={stats} tickets={tickets} onNavigate={setActiveView}
          onOpenTicket={setSelectedId} user={user} loading={loading} error={error} onRetry={refresh} />
      )}
      {activeView === "tickets" && (
        <TicketsView filteredTickets={filteredTickets} filter={filter} setFilter={setFilter}
          onOpenTicket={setSelectedId} loading={loading} error={error} onRetry={refresh} />
      )}
      {activeView === "users" && (
        <PlaceholderView icon={Users} title="Vista de Usuarios"
          subtitle="Conectar con tabla Usuarios de Supabase" />
      )}
      {activeView === "reports" && (
        <PlaceholderView icon={BarChart3} title="Reportes"
          subtitle="Integrar gráficas con datos de Supabase" />
      )}
      {activeView === "config" && (
        <PlaceholderView icon={Settings} title="Configuración"
          subtitle="SLAs, categorías, notificaciones, integraciones" />
      )}
      {selectedTicket && (
        <TicketDetail ticket={selectedTicket} agents={agents}
          onClose={() => setSelectedId(null)} onSave={updateTicket} isAgent={false} />
      )}
    </AppLayout>
  );
}

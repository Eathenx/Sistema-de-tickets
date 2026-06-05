import { Inbox } from "lucide-react";
import { KpiCard } from "../components/dashboard/KpiCard";
import { StatusBadge } from "../components/tickets/StatusBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorBanner } from "../components/ui/ErrorBanner";

const STATUS_INFO = [
  { key: "open",     label: "En proceso", color: "bg-[#d63384]" },
  { key: "pending",  label: "Pendientes", color: "bg-[#b8910a]" },
  { key: "resolved", label: "Finalizados", color: "bg-[#16a34a]" },
  { key: "closed",   label: "Bloqueados",  color: "bg-[#cc3333]" },
];

export function DashboardView({ stats, tickets, onNavigate, onOpenTicket, user, loading, error, onRetry }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-base font-semibold text-[#1a1a1a] dark:text-white">
            Bienvenido, {user?.name ?? "Admin"}
          </p>
          <p className="text-xs text-[#7a6a50] dark:text-[#888] mt-0.5">
            Resumen de actividad · {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          onClick={() => onNavigate("tickets")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors"
        >
          Ver tickets
        </button>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} onRetry={onRetry} /></div>}

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
            <KpiCard type="pending"  value={stats.pending} />
            <KpiCard type="resolved" value={stats.resolved} />
            <KpiCard type="urgent"   value={stats.urgent} />
            <KpiCard type="avgTime"  value="—" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#b0a07a] dark:border-[#2a2a2a] flex items-center">
                <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white flex-1 uppercase tracking-wide">Tickets recientes</span>
                <button onClick={() => onNavigate("tickets")} className="text-xs text-[#16a34a] hover:underline">Ver todos →</button>
              </div>
              {tickets.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-[#7a6a50] dark:text-[#666]">
                  <Inbox size={24} className="mx-auto mb-2 text-[#a09070] dark:text-[#444]" />
                  Sin tickets registrados
                </div>
              ) : (
                tickets.slice(0, 4).map(t => (
                  <div
                    key={t._id} onClick={() => onOpenTicket(t.id)}
                    className="px-4 py-2.5 flex items-center gap-3 border-b border-[#b8a880] dark:border-[#2a2a2a] last:border-none hover:bg-[#bfae88] dark:hover:bg-[#252525] cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1a1a1a] dark:text-[#e0d8cc] truncate">{t.title}</p>
                      <p className="text-[11px] text-[#5a4a30] dark:text-[#666]">{t.id} · {t.requester}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              )}
            </div>

            <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#b0a07a] dark:border-[#2a2a2a]">
                <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white uppercase tracking-wide">Distribución por estado</span>
              </div>
              <div className="px-4 py-4 flex flex-col gap-3">
                {STATUS_INFO.map(({ key, label, color }) => {
                  const row = stats.byStatus.find(s => s.key === key);
                  const pct = row && row.total > 0 ? Math.round((row.count / row.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#3a2a1a] dark:text-[#aaa] font-medium">{label}</span>
                        <span className="text-xs font-semibold text-[#1a1a1a] dark:text-[#e0d8cc]">
                          {row?.count ?? 0} <span className="text-[#7a6a50] dark:text-[#666] font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 bg-[#a09070] dark:bg-[#333] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

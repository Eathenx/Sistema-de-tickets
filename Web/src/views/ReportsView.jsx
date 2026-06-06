import { useState, useEffect, useMemo } from "react";
import { Inbox, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { StatusBadge } from "../components/tickets/StatusBadge";
import { PriorityBadge } from "../components/tickets/PriorityBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { getInitials } from "../utils/ticketUtils";

// ── Otros Incidentes hook ──────────────────────────────────────
function useOtrosIncidentes() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: rows, error: rErr }, { data: usrs }, { data: agts }] = await Promise.all([
        supabase.from("Otros_incidentes").select("*").order("Fecha", { ascending: false }),
        supabase.from("Usuarios").select("id, Usuario"),
        supabase.from("Agentes").select("id, Nombre"),
      ]);
      if (rErr) throw rErr;
      const usrMap = Object.fromEntries((usrs ?? []).map(u => [u.id, u]));
      const agtMap = Object.fromEntries((agts ?? []).map(a => [a.id, a]));
      setItems((rows ?? []).map(r => ({
        _id:         r.id,
        id:          `OI-${String(r.id).padStart(4, "0")}`,
        usuario:     usrMap[r.Usuario_ID]?.Usuario ?? `#${r.Usuario_ID ?? "?"}`,
        departamento: r.Departamento ?? "—",
        status:      r.Status        ?? "open",
        categoria:   r.Categoria     ?? "—",
        fecha:       r.Fecha ? new Date(r.Fecha).toLocaleDateString("es-ES") : "—",
        descripcion: r.Descripcion   ?? "",
        prioridad:   r.Prioridad     ?? "medium",
        agente:      agtMap[r.Agente]?.Nombre ?? "Sin asignar",
        agtInitials: getInitials(agtMap[r.Agente]?.Nombre),
      })));
    } catch (err) {
      setError(err.message ?? "Error al cargar otros incidentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { items, loading, error, refresh: load };
}

// ── Bar chart helpers ──────────────────────────────────────────
const CHART_COLORS = [
  "bg-[#16a34a]", "bg-[#2563eb]", "bg-[#d63384]",
  "bg-[#b8910a]", "bg-[#7c3aed]", "bg-[#0891b2]",
  "bg-[#ea580c]", "bg-[#dc2626]",
];

function BarChart({ data, title }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#b0a07a] dark:border-[#2a2a2a]">
        <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white uppercase tracking-wide">{title}</span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-xs text-[#7a6a50] dark:text-[#666] text-center py-6">Sin datos</p>
        ) : (
          data.map(({ label, count }, i) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#3a2a1a] dark:text-[#aaa] font-medium truncate max-w-[200px]" title={label}>
                  {label}
                </span>
                <span className="text-xs font-bold text-[#1a1a1a] dark:text-[#e0d8cc] ml-2">{count}</span>
              </div>
              <div className="h-2.5 bg-[#a09070] dark:bg-[#333] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${CHART_COLORS[i % CHART_COLORS.length]} transition-all duration-700`}
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────
export function ReportsView({ tickets }) {
  const { items, loading: loadingOI, error: errorOI, refresh } = useOtrosIncidentes();
  const [oiSearch, setOiSearch] = useState("");

  // Tickets por tipo de incidente (category)
  const byCategory = useMemo(() => {
    const counts = {};
    tickets.forEach(t => { counts[t.category] = (counts[t.category] ?? 0) + 1; });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [tickets]);

  // Tickets por prioridad
  const byPriority = useMemo(() => {
    const order = ["urgent", "high", "medium", "low"];
    const labels = { urgent: "Urgente", high: "Alta", medium: "Media", low: "Baja" };
    const counts = {};
    tickets.forEach(t => { counts[t.priority] = (counts[t.priority] ?? 0) + 1; });
    return order
      .filter(p => counts[p] > 0)
      .map(p => ({ label: labels[p], count: counts[p] }));
  }, [tickets]);

  // Otros incidentes filtrados por búsqueda
  const filteredOI = useMemo(() => {
    if (!oiSearch) return items;
    const q = oiSearch.toLowerCase();
    return items.filter(i =>
      i.id.toLowerCase().includes(q)          ||
      i.usuario.toLowerCase().includes(q)      ||
      i.categoria.toLowerCase().includes(q)    ||
      i.agente.toLowerCase().includes(q)       ||
      i.descripcion.toLowerCase().includes(q)
    );
  }, [items, oiSearch]);

  return (
    <div className="flex flex-col gap-5">
      {/* Gráficas */}
      <div>
        <p className="text-xs font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-3">
          Gráficas de incidentes
        </p>
        {tickets.length === 0 ? (
          <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] p-10 text-center">
            <Inbox size={28} className="mx-auto mb-2 text-[#a09070] dark:text-[#444]" />
            <p className="text-xs text-[#7a6a50] dark:text-[#666]">No hay tickets para graficar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <BarChart data={byCategory} title="Tickets por tipo de incidente" />
            <BarChart data={byPriority} title="Tickets por prioridad" />
          </div>
        )}
      </div>

      {/* Otros Incidentes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest">
            Otros incidentes
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={oiSearch}
              onChange={e => setOiSearch(e.target.value)}
              className="border border-[#a09070] dark:border-[#3a3a3a] rounded-lg px-3 py-1 text-xs text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 w-44"
            />
            <button
              onClick={refresh}
              className="w-7 h-7 rounded-lg border border-[#a09070] dark:border-[#3a3a3a] flex items-center justify-center text-[#5a4a30] dark:text-[#666] hover:bg-[#b0a07a] dark:hover:bg-[#2a2a2a] transition-colors"
              title="Recargar"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {errorOI && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-2 mb-3">
            <AlertCircle size={15} className="text-red-400" />
            <p className="text-xs text-red-400 flex-1">{errorOI}</p>
            <button onClick={refresh} className="text-xs text-red-300 hover:underline">Reintentar</button>
          </div>
        )}

        {loadingOI ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#b0a078] dark:bg-[#252525] border-b border-[#a09070] dark:border-[#2a2a2a]">
                    {["ID", "Descripción / Categoría", "Usuario", "Departamento", "Agente", "Estado", "Prioridad", "Fecha"].map((h, i) => (
                      <th key={i} className="px-4 py-2.5 text-left text-[11px] font-bold text-[#2a1a0a] dark:text-[#888] uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOI.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#7a6a50] dark:text-[#666] text-sm">
                        <Inbox size={32} className="mx-auto mb-2 text-[#a09070] dark:text-[#444]" />
                        No se encontraron otros incidentes
                      </td>
                    </tr>
                  ) : (
                    filteredOI.map(item => (
                      <tr
                        key={item._id}
                        className="border-b border-[#b8a880] dark:border-[#2a2a2a] hover:bg-[#bfae88] dark:hover:bg-[#252525] transition-colors last:border-none"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-[11px] text-[#5a4a30] dark:text-[#666]">{item.id}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          <p className="text-[#1a1a1a] dark:text-[#e0d8cc] font-medium truncate text-xs">
                            {item.descripcion || "Sin descripción"}
                          </p>
                          <p className="text-[11px] text-[#5a4a30] dark:text-[#666] mt-0.5">{item.categoria}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#3a2a1a] dark:text-[#aaa] whitespace-nowrap">{item.usuario}</td>
                        <td className="px-4 py-3 text-xs text-[#3a2a1a] dark:text-[#aaa] whitespace-nowrap">{item.departamento}</td>
                        <td className="px-4 py-3 text-xs text-[#3a2a1a] dark:text-[#aaa] whitespace-nowrap">{item.agente}</td>
                        <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                        <td className="px-4 py-3"><PriorityBadge priority={item.prioridad} /></td>
                        <td className="px-4 py-3 text-xs text-[#5a4a30] dark:text-[#666] whitespace-nowrap">{item.fecha}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredOI.length > 0 && (
              <div className="px-4 py-2 border-t border-[#b0a07a] dark:border-[#2a2a2a]">
                <p className="text-[11px] text-[#7a6a50] dark:text-[#666]">
                  {filteredOI.length} registro{filteredOI.length !== 1 ? "s" : ""}
                  {oiSearch ? ` · filtrado de ${items.length}` : ""}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

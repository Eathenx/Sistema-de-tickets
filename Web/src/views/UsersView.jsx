import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorBanner } from "../components/ui/ErrorBanner";

const ROLES = ["usuario", "agente", "admin"];

const ROLE_STYLES = {
  admin:   "bg-[#16a34a] text-white",
  agente:  "bg-[#2563eb] text-white",
  usuario: "bg-[#b8910a] text-white",
};

function RoleBadge({ role }) {
  const key = role?.toLowerCase();
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_STYLES[key] ?? "bg-[#555] text-white"}`}>
      {role ?? "—"}
    </span>
  );
}

function useUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from("Usuarios").select("*").order("id");
    if (err) setError(err.message);
    else setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateRole = async (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, Rol: newRole } : u));
    const { error: err } = await supabase.from("Usuarios").update({ Rol: newRole }).eq("id", userId);
    if (err) {
      console.error("Error al actualizar rol:", err.message);
      load();
    }
  };

  return { users, loading, error, refresh: load, updateRole };
}

export function UsersView() {
  const { users, loading, error, refresh, updateRole } = useUsers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-[#1a1a1a] dark:text-white">Usuarios del sistema</p>
          <p className="text-xs text-[#7a6a50] dark:text-[#888] mt-0.5">
            Gestiona los roles — cambia el rol para asignar o revocar permisos de agente
          </p>
        </div>
        <button
          onClick={refresh}
          className="w-8 h-8 rounded-lg border border-[#a09070] dark:border-[#3a3a3a] flex items-center justify-center text-[#5a4a30] dark:text-[#666] hover:bg-[#b0a07a] dark:hover:bg-[#2a2a2a] transition-colors"
          title="Recargar"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={refresh} />}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#b0a078] dark:bg-[#252525] border-b border-[#a09070] dark:border-[#2a2a2a]">
                  {["#", "Usuario", "Correo", "Departamento", "Rol actual", "Cambiar rol"].map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left text-[11px] font-bold text-[#2a1a0a] dark:text-[#888] uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#7a6a50] dark:text-[#666] text-sm">
                      Sin usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr
                      key={u.id}
                      className="border-b border-[#b8a880] dark:border-[#2a2a2a] hover:bg-[#bfae88] dark:hover:bg-[#252525] transition-colors last:border-none"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-[#5a4a30] dark:text-[#666]">#{u.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#16a34a] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {u.Usuario?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-[#1a1a1a] dark:text-[#e0d8cc] font-medium text-xs">{u.Usuario ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#3a2a1a] dark:text-[#aaa]">{u.Correo ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-[#3a2a1a] dark:text-[#aaa]">{u.Departmento ?? "—"}</td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.Rol} />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.Rol ?? ""}
                          onChange={e => updateRole(u.id, e.target.value)}
                          className="border border-[#a09070] dark:border-[#3a3a3a] rounded-lg px-2.5 py-1.5 text-xs text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] cursor-pointer"
                        >
                          <option value="">— Sin rol —</option>
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {users.length > 0 && (
            <div className="px-4 py-2 border-t border-[#b0a07a] dark:border-[#2a2a2a] flex items-center gap-4">
              <p className="text-[11px] text-[#7a6a50] dark:text-[#666]">
                {users.length} usuario{users.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-3 ml-auto">
                {ROLES.map(r => {
                  const count = users.filter(u => u.Rol?.toLowerCase() === r).length;
                  return count > 0 ? (
                    <span key={r} className="flex items-center gap-1 text-[11px] text-[#5a4a30] dark:text-[#666]">
                      <span className={`w-2 h-2 rounded-full ${ROLE_STYLES[r]?.split(" ")[0]}`} />
                      {r}: {count}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

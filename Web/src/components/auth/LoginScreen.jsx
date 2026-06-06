import { useState } from "react";
import { Ticket, Mail, Lock, AlertCircle, ShieldCheck, Sun, Moon, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useDarkMode } from "../../hooks/useDarkMode";
import { getInitials } from "../../utils/ticketUtils";

export function LoginScreen({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [dark, setDark] = useDarkMode();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!email.trim())    { setError("Ingresa tu correo.");    return; }
    if (!password)        { setError("Ingresa tu contraseña."); return; }

    setLoading(true);
    try {
      const { data: user, error: dbErr } = await supabase
        .from("Usuarios")
        .select("id, Usuario, Correo, Rol, Contraseña")
        .eq("Correo", email.toLowerCase().trim())
        .maybeSingle();

      if (dbErr) throw dbErr;

      if (!user) {
        setError("Correo no registrado.");
        return;
      }
      if (user.Contraseña !== password) {
        setError("Contraseña incorrecta.");
        return;
      }

      const role = user.Rol?.toLowerCase();
      if (role !== "admin" && role !== "agente") {
        setError("Tu cuenta no tiene permiso para acceder al panel.");
        return;
      }

      onLogin({
        id:        user.id,
        role,
        name:      user.Usuario,
        initials:  getInitials(user.Usuario),
        email:     user.Correo,
        agentName: user.Usuario,
      });
    } catch (err) {
      setError(err.message ?? "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ece6dd] dark:bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-[380px] bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-2xl border border-[#b0a07a] dark:border-[#2a2a2a] shadow-2xl">
        <div className="px-8 pt-8 pb-6 text-center border-b border-[#b0a07a] dark:border-[#2a2a2a]">
          <div className="w-12 h-12 rounded-xl bg-[#16a34a] flex items-center justify-center mx-auto mb-4">
            <Ticket size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-[#1a1a1a] dark:text-white tracking-tight uppercase">
            Sistema Tickets
          </h1>
          <p className="text-xs text-[#5a4a30] dark:text-[#888] mt-1">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest block mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a50] dark:text-[#555]" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="correo@empresa.com" autoComplete="email"
                disabled={loading}
                className="w-full border border-[#a09070] dark:border-[#3a3a3a] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] placeholder:text-[#a09070] dark:placeholder:text-[#555] disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a50] dark:text-[#555]" />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password"
                disabled={loading}
                className="w-full border border-[#a09070] dark:border-[#3a3a3a] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] placeholder:text-[#a09070] dark:placeholder:text-[#555] disabled:opacity-60"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} className="flex-shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Verificando…</>
              : <><ShieldCheck size={15} /> Iniciar sesión</>
            }
          </button>
        </form>

        <div className="px-8 pb-6 flex justify-center">
          <button
            onClick={() => setDark(d => !d)}
            className="text-xs text-[#7a6a50] dark:text-[#555] flex items-center gap-1.5 hover:text-[#1a1a1a] dark:hover:text-[#aaa] transition-colors"
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          </button>
        </div>
      </div>
    </div>
  );
}
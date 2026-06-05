import { useState } from "react";
import { X, Save } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { getInitials } from "../../utils/ticketUtils";

export function TicketDetail({ ticket, agents, onClose, onSave, isAgent = false }) {
  const [status,  setStatus]  = useState(ticket.status);
  const [agentId, setAgentId] = useState(
    agents.find(a => a.name === ticket.agent)?.id ?? ""
  );

  if (!ticket) return null;

  const handleSave = () => {
    const agent = agents.find(a => a.id === agentId);
    onSave(ticket.id, {
      status,
      agent:         isAgent ? ticket.agent : (agent?.name ?? ticket.agent),
      agentInitials: isAgent ? ticket.agentInitials : getInitials(agent?.name ?? ticket.agent),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-2xl w-[440px] max-h-[90vh] overflow-y-auto border border-[#a09070] dark:border-[#2a2a2a] shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#b0a07a] dark:border-[#2a2a2a] flex items-start gap-3">
          <div className="flex-1">
            <p className="font-mono text-[11px] text-[#5a4a30] dark:text-[#666] mb-1">{ticket.id}</p>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-white">{ticket.title}</p>
            <p className="text-xs text-[#5a4a30] dark:text-[#888] mt-0.5">
              {ticket.category}
              {ticket.incidenteTiempo ? ` · Tiempo estimado: ${ticket.incidenteTiempo}` : ""}
              {" · "}{ticket.created}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[#a09070] dark:border-[#3a3a3a] flex items-center justify-center text-[#5a4a30] dark:text-[#666] hover:bg-[#b0a07a] dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1.5">Descripción</p>
            <p className="text-sm text-[#1a1a1a] dark:text-[#ccc] leading-relaxed">{ticket.desc || "Sin descripción."}</p>
          </div>

          <hr className="border-[#b0a07a] dark:border-[#2a2a2a]" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Estado actual</p>
              <StatusBadge status={ticket.status} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Prioridad</p>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Solicitante</p>
              <p className="text-sm text-[#1a1a1a] dark:text-[#e0d8cc]">{ticket.requester}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Creado</p>
              <p className="text-sm text-[#1a1a1a] dark:text-[#e0d8cc]">{ticket.created}</p>
            </div>
            {ticket.departamento && (
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Departamento</p>
                <p className="text-sm text-[#1a1a1a] dark:text-[#e0d8cc]">{ticket.departamento}</p>
              </div>
            )}
          </div>

          <hr className="border-[#b0a07a] dark:border-[#2a2a2a]" />

          <div>
            <label className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest block mb-1.5">
              Cambiar estado
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-[#a09070] dark:border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a]"
            >
              <option value="open">En proceso</option>
              <option value="pending">Pendiente</option>
              <option value="resolved">Finalizado</option>
              <option value="closed">Bloqueado</option>
            </select>
          </div>

          {!isAgent && (
            <div>
              <label className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest block mb-1.5">
                Reasignar agente
              </label>
              <select
                value={agentId}
                onChange={e => setAgentId(e.target.value)}
                className="w-full border border-[#a09070] dark:border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#e0d8cc] bg-[#d4c4a0] dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a]"
              >
                <option value="">Sin asignar</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          {isAgent && (
            <div>
              <p className="text-[10px] font-bold text-[#5a4a30] dark:text-[#666] uppercase tracking-widest mb-1">Agente asignado</p>
              <p className="text-sm text-[#1a1a1a] dark:text-[#e0d8cc]">{ticket.agent}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#b0a07a] dark:border-[#2a2a2a] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#a09070] dark:border-[#3a3a3a] text-sm text-[#3a2a1a] dark:text-[#888] hover:bg-[#b8a880] dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#16a34a] text-white text-sm font-semibold hover:bg-[#15803d] transition-colors flex items-center gap-1.5"
          >
            <Save size={13} /> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

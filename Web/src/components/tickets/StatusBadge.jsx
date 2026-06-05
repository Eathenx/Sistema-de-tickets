const STATUS_STYLES = {
  open:     "bg-[#d63384] text-white",
  pending:  "bg-[#b8910a] text-white",
  resolved: "bg-[#16a34a] text-white",
  closed:   "bg-[#cc3333] text-white",
};
export const STATUS_LABELS = { open: "En proceso", pending: "Pendiente", resolved: "Finalizado", closed: "Bloqueado" };

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.open}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

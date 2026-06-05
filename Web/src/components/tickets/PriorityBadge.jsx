const PRIO_STYLES = {
  urgent: { badge: "bg-[#cc2222] text-white", dot: "bg-white" },
  high:   { badge: "bg-[#d06020] text-white", dot: "bg-white" },
  medium: { badge: "bg-[#b8910a] text-white", dot: "bg-white" },
  low:    { badge: "bg-[#16a34a] text-white", dot: "bg-white" },
};
const PRIO_LABELS = { urgent: "Urgente", high: "Alta", medium: "Media", low: "Baja" };

export function PriorityBadge({ priority }) {
  const cfg = PRIO_STYLES[priority] ?? PRIO_STYLES.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {PRIO_LABELS[priority] ?? priority}
    </span>
  );
}

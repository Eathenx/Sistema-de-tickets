import { Clock, CheckCircle2, AlertCircle, Gauge, TrendingUp, TrendingDown } from "lucide-react";

const KPI_CONFIG = {
  pending:  { label: "Tickets pendientes",      icon: Clock,        bg: "bg-amber-500/20", iconColor: "text-amber-500",  trend: "+2 desde ayer",       trendUp: false },
  resolved: { label: "Resueltos",               icon: CheckCircle2, bg: "bg-[#16a34a]/20", iconColor: "text-[#22c55e]",  trend: "+18% vs. ayer",       trendUp: true  },
  urgent:   { label: "Urgentes abiertos",       icon: AlertCircle,  bg: "bg-red-500/20",   iconColor: "text-red-400",    trend: "−1 desde ayer",       trendUp: true  },
  avgTime:  { label: "Tiempo prom. resolución", icon: Gauge,        bg: "bg-[#16a34a]/20", iconColor: "text-[#22c55e]",  trend: "−30min vs. sem. ant.", trendUp: true  },
};

export function KpiCard({ type, value }) {
  const cfg = KPI_CONFIG[type];
  const Icon = cfg.icon;
  const TrendIcon = cfg.trendUp ? TrendingDown : TrendingUp;
  const trendColor = cfg.trendUp ? "text-[#22c55e]" : "text-red-400";
  return (
    <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#5a4a30] dark:text-[#888]">{cfg.label}</span>
        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
      </div>
      <p className="text-2xl font-medium text-[#1a1a1a] dark:text-white tracking-tight">{value}</p>
      <p className={`text-xs mt-1 flex items-center gap-1 ${trendColor}`}>
        <TrendIcon size={11} /> {cfg.trend}
      </p>
    </div>
  );
}

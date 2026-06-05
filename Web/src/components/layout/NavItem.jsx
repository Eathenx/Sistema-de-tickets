export function NavItem({ label, Icon, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-[#1a2a1a] text-[#4caf50] font-semibold border border-[#16a34a]/30"
          : "text-[#888] hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      <Icon size={16} />
      {label}
      {badge != null && (
        <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

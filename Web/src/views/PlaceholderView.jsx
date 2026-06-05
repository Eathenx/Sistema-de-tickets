export function PlaceholderView({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-[#c8b89a] dark:bg-[#1d1d1d] rounded-xl border border-[#b0a07a] dark:border-[#2a2a2a] p-14 text-center">
      <Icon size={36} className="mx-auto mb-3 text-[#a09070] dark:text-[#3a3a3a]" />
      <p className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1">{title}</p>
      <p className="text-xs text-[#5a4a30] dark:text-[#666]">{subtitle}</p>
    </div>
  );
}

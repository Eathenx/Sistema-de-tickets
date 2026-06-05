import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex items-center gap-3">
      <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
      <p className="text-sm text-red-400 flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <RefreshCw size={12} /> Reintentar
        </button>
      )}
    </div>
  );
}

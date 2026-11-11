import React from 'react';
import { History as HistoryIcon, Trash2, ArrowUpLeft, Copy, Clock } from 'lucide-react';
import { HistoryItem, ThemeConfig } from '../types/calculator';

interface HistoryDrawerProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose?: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  theme,
  isOpen,
  onClose,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text.replace(/,/g, '')).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => {});
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border transition-all duration-300 p-5 ${
        theme.displayBg
      } ${!isOpen ? 'hidden lg:flex' : 'flex'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold tracking-tight">Calculation Tape</h2>
          <span className="text-xs text-slate-400 font-mono">({history.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear all history"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px] sm:max-h-[460px]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 p-4">
            <Clock className="w-8 h-8 opacity-30 mb-2 stroke-1" />
            <p className="text-xs font-medium">No calculation history</p>
            <p className="text-[11px] opacity-60 mt-1 max-w-[200px]">
              Equations and results will automatically appear here as you calculate.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="group p-3 rounded-xl border border-transparent hover:border-indigo-500/30 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative"
              title="Click to restore result to calculator"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                <span>{formatTime(item.timestamp)}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopy(item.id, item.result, e)}
                    className="p-1 rounded hover:bg-white/10 text-slate-300"
                    title="Copy result"
                  >
                    {copiedId === item.id ? (
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <span title="Load into calculator">
                    <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400 truncate text-right">
                {item.expression} =
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-right tracking-tight tabular-nums">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="pt-3 border-t border-inherit mt-3 text-[11px] text-slate-400 text-center">
        Tip: Click any entry to insert its value
      </div>
    </div>
  );
};

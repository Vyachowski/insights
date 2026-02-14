import { TrendingDown, TrendingUp } from "lucide-react";
import { formatNumber } from "../utils.ts";

export default function MetricCard({
  title,
  value,
  trend,
  isProfit,
}: {
  title: string;
  value: number;
  trend?: number;
  isProfit?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-[1.02] group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="text-slate-400 text-sm font-medium mb-3 tracking-wider uppercase">
          {title}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-4xl font-bold text-white tracking-tight">
            {formatNumber(value)}
            <span className="text-lg text-slate-500 ml-1">₽</span>
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                trend >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
}

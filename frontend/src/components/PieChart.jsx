import { useState } from "react";
import { motion } from "framer-motion";

export default function PieChart({ data, centerLabel, centerSub }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const r = 80;
  const cx = 110;
  const cy = 110;

  const slices = data.map((d) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = d.value / total > 0.5 ? 1 : 0;
    const pct = ((d.value / total) * 100).toFixed(1);
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      pct,
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-shrink-0 relative">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              stroke="white"
              strokeWidth="2"
              className="transition-opacity duration-150 cursor-pointer"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.45 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{s.label}: {s.pct}%</title>
            </path>
          ))}
          <circle cx={cx} cy={cy} r="36" fill="white" className="dark:hidden" />
          <circle cx={cx} cy={cy} r="36" fill="#0f172a" className="hidden dark:block" />
          {hovered !== null ? (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300" fontSize="11" fontWeight="700">{slices[hovered].pct}%</text>
              <text x={cx} y={cy + 9} textAnchor="middle" className="fill-slate-500" fontSize="9">{slices[hovered].label}</text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300" fontSize="11" fontWeight="600">{centerLabel}</text>
              <text x={cx} y={cy + 9} textAnchor="middle" className="fill-slate-500" fontSize="9">{centerSub}</text>
            </>
          )}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 flex-1">
        {slices.map((s, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 cursor-default"
            animate={{ opacity: hovered === null || hovered === i ? 1 : 0.45 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{s.label}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto tabular-nums">{s.pct}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

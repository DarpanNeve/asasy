import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  INVESTOR_TYPE_DUMMY,
  INVESTOR_TYPE_COLORS,
  INVESTOR_TYPE_DESCS,
} from "../../data/chartData";
import { api } from "../../services/api";

const R = 58;
const CX = 90;
const CY = 90;
const CIRCUMFERENCE = 2 * Math.PI * R;

function DonutSegment({ pct, total, color, cumulativeValue }) {
  const cumulativePct = (cumulativeValue / total) * 100;
  const segPct = (pct / total) * 100;
  const length = (segPct / 100) * CIRCUMFERENCE;
  const rotateDeg = (cumulativePct / 100) * 360 - 90;
  return (
    <circle
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={22}
      strokeDasharray={`${Math.max(0, length - 5)} ${CIRCUMFERENCE}`}
      strokeLinecap="butt"
      style={{
        transform: `rotate(${rotateDeg}deg)`,
        transformOrigin: `${CX}px ${CY}px`,
      }}
    />
  );
}

export default function InvestorDistributionSection() {
  const [data, setData] = useState(INVESTOR_TYPE_DUMMY);

  useEffect(() => {
    api
      .get("/onboarding/investors/stats")
      .then(({ data: res }) => {
        if (res.total > 100 && res.by_type?.length) {
          const mapped = res.by_type.map((d) => ({
            label: d.type,
            value: d.count,
            color: INVESTOR_TYPE_COLORS[d.type] || "#94a3b8",
          }));
          setData(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
            Investor Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Investor Type{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Distribution
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A diverse, verified network of investors — each screened for sector
            fit, stage alignment, and genuine commitment to innovation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <svg
                viewBox="0 0 180 180"
                className="w-full h-full drop-shadow-xl"
              >
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  strokeWidth={22}
                  className="stroke-slate-100 dark:stroke-slate-800"
                />
                {data.map((d) => {
                  const seg = (
                    <DonutSegment
                      key={d.label}
                      pct={d.value}
                      total={total}
                      color={d.color}
                      cumulativeValue={cumulative}
                    />
                  );
                  cumulative += d.value;
                  return seg;
                })}
                <text
                  x={CX}
                  y={CY - 8}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  className="fill-slate-900 dark:fill-white"
                >
                  Investors
                </text>
                <text
                  x={CX}
                  y={CY + 10}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-slate-500 dark:fill-slate-400"
                >
                  by type
                </text>
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {data.map((item, i) => {
              const pct = ((item.value / total) * 100).toFixed(1);
              const desc =
                INVESTOR_TYPE_DESCS[item.label] || "Verified investor category";
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.label}
                      </span>
                      <span
                        className="text-sm font-black"
                        style={{ color: item.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                      <motion.div
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + i * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

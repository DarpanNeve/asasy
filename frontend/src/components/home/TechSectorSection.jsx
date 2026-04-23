import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TECH_SECTOR_DUMMY,
  TECH_CATEGORY_COLORS,
  TECH_SECTOR_DESCS,
} from "../../data/chartData";
import { api } from "../../services/api";

export default function TechSectorSection() {
  const [data, setData] = useState(TECH_SECTOR_DUMMY);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    api
      .get("/onboarding/technologies/stats")
      .then(({ data: res }) => {
        if (res.total > 0 && res.by_category?.length) {
          const mapped = res.by_category.map((d) => ({
            label: d.category,
            value: d.count,
            color: TECH_CATEGORY_COLORS[d.category] || "#94a3b8",
          }));
          setData(mapped);
          setTotalCount(res.total);
        }
      })
      .catch(() => {});
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value));
  const displayTotal = totalCount ?? total;

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
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
            Technology Pipeline
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Technology Distribution{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              by Sector
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Across evaluated technologies, here's how innovation is distributed
            across the key sectors driving the next decade of growth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-5">
            {data.map((item, i) => {
              const pct = ((item.value / total) * 100).toFixed(1);
              const barWidth = (item.value / maxValue) * 100;
              const desc =
                TECH_SECTOR_DESCS[item.label] || "Emerging technology category";
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        {desc}
                      </span>
                      <span
                        className="text-sm font-black w-12 text-right"
                        style={{ color: item.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="h-2.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${item.color}aa, ${item.color})`,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${barWidth}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: 0.1 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="text-3xl font-black mb-1">
                {displayTotal >= 1000
                  ? `${(displayTotal / 1000).toFixed(1)}K+`
                  : `${displayTotal}+`}
              </div>
              <div className="text-blue-100 text-sm">
                Technologies evaluated across all sectors
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-1">
                {data.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Active sectors with verified deal flow
              </div>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 rounded-2xl p-6">
              <div className="text-3xl font-black text-teal-700 dark:text-teal-400 mb-1">
                92%
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Assessment accuracy across all sectors
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Top Sectors
              </p>
              <div className="space-y-2">
                {[...data]
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 3)
                  .map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {s.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

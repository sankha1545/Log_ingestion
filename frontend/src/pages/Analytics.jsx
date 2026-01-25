import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useLogs } from "../hooks/useLogs";

const COLORS = ["#ef4444", "#facc15", "#3b82f6", "#64748b"];

const DAILY_RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "60D", days: 60 },
];

export default function Analytics() {
  const { logs } = useLogs({});
  const [mode, setMode] = useState("daily"); // daily | monthly | yearly
  const [dailyRange, setDailyRange] = useState(7);

  /* ---------- TIME SERIES ---------- */
  const timeSeries = useMemo(() => {
    const now = new Date();
    let start;

    if (mode === "daily") {
      start = new Date(now.getTime() - dailyRange * 24 * 60 * 60 * 1000);
    } else if (mode === "monthly") {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      start = new Date(now.getFullYear() - 5, 0, 1);
    }

    const map = {};

    logs.forEach((log) => {
      const d = new Date(log.timestamp);
      if (d < start) return;

      let key;
      if (mode === "daily") {
        key = d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
      } else if (mode === "monthly") {
        key = d.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });
      } else {
        key = d.getFullYear().toString();
      }

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([time, count]) => ({
      time,
      count,
    }));
  }, [logs, mode, dailyRange]);

  /* ---------- LOGS BY LEVEL ---------- */
  const byLevel = useMemo(() => {
    const levels = { error: 0, warn: 0, info: 0, debug: 0 };
    logs.forEach((l) => {
      if (levels[l.level] !== undefined) levels[l.level]++;
    });
    return Object.entries(levels).map(([name, value]) => ({
      name,
      value,
    }));
  }, [logs]);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 Analytics Dashboard</h1>
        <span className="text-sm text-slate-500">
          Live log insights & trends
        </span>
      </div>

      {/* LINE GRAPH CARD */}
      <div className="p-5 bg-white border shadow dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Logs Over Time</h2>

          {/* MODE SWITCH */}
          <div className="flex items-center gap-2">
            {["daily", "monthly", "yearly"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  mode === m
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* DAILY SUB FILTER */}
        {mode === "daily" && (
          <div className="flex gap-2 mb-3">
            {DAILY_RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDailyRange(r.days)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  dailyRange === r.days
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                }`}
              >
                Last {r.label}
              </button>
            ))}
          </div>
        )}

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GRID: BAR + PIE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* BAR */}
        <div className="p-5 bg-white border shadow dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Logs by Level</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byLevel}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="p-5 bg-white border shadow dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">
            Severity Distribution
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byLevel}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {byLevel.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

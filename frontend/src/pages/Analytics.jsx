import { useMemo } from "react";
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

export default function Analytics() {
  // live logs via websocket + API
  const { logs } = useLogs({});

  // 🔵 Logs per minute (time series)
  const timeSeries = useMemo(() => {
    const map = {};

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const key = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([time, count]) => ({
      time,
      count,
    }));
  }, [logs]);

  // 🟣 Logs by severity
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
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Analytics (Live)</h1>

      {/* 🔵 TIME SERIES */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
        <h2 className="mb-2 font-semibold">Logs Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🟠 BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
        <h2 className="mb-2 font-semibold">Logs by Level</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byLevel}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔴 PIE */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
        <h2 className="mb-2 font-semibold">Severity Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={byLevel}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
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
  );
}

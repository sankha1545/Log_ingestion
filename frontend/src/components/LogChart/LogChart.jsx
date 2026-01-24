import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LogChart({ logs }) {
  const counts = ["error", "warn", "info", "debug"].map(level => ({
    level,
    count: logs.filter(l => l.level === level).length
  }));

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
      <h3 className="text-sm mb-2 text-slate-500">Logs by Level</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={counts}>
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

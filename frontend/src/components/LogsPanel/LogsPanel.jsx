import LogItem from "./LogItem";

export default function LogsPanel({ logs, loading }) {
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-[#0f172a] rounded-xl p-4 shadow">
      {logs.map((log, i) => (
        <LogItem key={i} log={log} />
      ))}
    </div>
  );
}

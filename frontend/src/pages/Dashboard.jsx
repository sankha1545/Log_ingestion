import { useState, useEffect } from "react";
import { useLogs } from "../hooks/useLogs";
import FilterBar from "../components/FilterBar/FilterBar";
import LogsList from "../components/LogsList/LogsList";

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const { logs, loading } = useLogs(filters);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">SignalHub Logs</h1>
          <p className="text-sm text-slate-500">
            Real-time Log Ingestion & Querying
          </p>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 text-sm"
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow">
        <FilterBar filters={filters} setFilters={setFilters} />
      </section>

      {/* Logs */}
      <section className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow overflow-hidden">
        <LogsList logs={logs} loading={loading} />
      </section>
    </div>
  );
}

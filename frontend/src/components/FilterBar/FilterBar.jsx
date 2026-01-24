import { useState } from "react";

export default function FilterBar({ filters, setFilters, setSort }) {
  const [local, setLocal] = useState(filters);

  const applyFilters = () => {
    setFilters(local);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">

      {/* Search */}
      <div>
        <label className="block text-xs mb-1 text-slate-500 dark:text-slate-400">
          Search (case-sensitive)
        </label>
        <input
          className="w-full bg-white dark:bg-slate-800 
            border border-slate-300 dark:border-slate-700 
            rounded-lg px-3 py-2 text-sm 
            text-slate-900 dark:text-white 
            placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Exact message text..."
          value={local.message || ""}
          onChange={(e) =>
            setLocal({ ...local, message: e.target.value })
          }
        />
      </div>

      {/* Level */}
      <div>
        <label className="block text-xs mb-1 text-slate-500 dark:text-slate-400">
          Level
        </label>
        <select
          className="w-full bg-white dark:bg-slate-800 
            border border-slate-300 dark:border-slate-700 
            rounded-lg px-3 py-2 text-sm 
            text-slate-900 dark:text-white"
          value={local.level || ""}
          onChange={(e) =>
            setLocal({ ...local, level: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="error">Error</option>
          <option value="warn">Warn</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-xs mb-1 text-slate-500 dark:text-slate-400">
          From
        </label>
        <input
          type="datetime-local"
          className="w-full bg-white dark:bg-slate-800 
            border border-slate-300 dark:border-slate-700 
            rounded-lg px-3 py-2 text-sm 
            text-slate-900 dark:text-white"
          value={local.timestamp_start || ""}
          onChange={(e) =>
            setLocal({ ...local, timestamp_start: e.target.value })
          }
        />
      </div>

      {/* End Time */}
      <div>
        <label className="block text-xs mb-1 text-slate-500 dark:text-slate-400">
          To
        </label>
        <input
          type="datetime-local"
          className="w-full bg-white dark:bg-slate-800 
            border border-slate-300 dark:border-slate-700 
            rounded-lg px-3 py-2 text-sm 
            text-slate-900 dark:text-white"
          value={local.timestamp_end || ""}
          onChange={(e) =>
            setLocal({ ...local, timestamp_end: e.target.value })
          }
        />
      </div>

      {/* Search Button */}
      <button
        onClick={applyFilters}
        className="h-10 rounded-lg 
          bg-indigo-600 text-white 
          hover:bg-indigo-700 transition text-sm"
      >
        Search
      </button>

      {/* Clear */}
      <button
        onClick={() => {
          setLocal({});
          setFilters({});
        }}
        className="h-10 rounded-lg 
          bg-slate-300 dark:bg-slate-700 
          text-slate-800 dark:text-white 
          hover:opacity-80 transition text-sm"
      >
        Clear
      </button>
    </div>
  );
}

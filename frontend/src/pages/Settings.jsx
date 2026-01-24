import { useState } from "react";

export default function Settings() {
  const [refresh, setRefresh] = useState(5000);
  const [dark, setDark] = useState(true);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="bg-white dark:bg-slate-900 p-4 rounded shadow space-y-4">
        <div>
          <label className="text-sm">Auto Refresh (ms)</label>
          <input
            type="number"
            value={refresh}
            onChange={(e) => setRefresh(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          <span>Enable Dark Mode</span>
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white rounded">
          Save Settings
        </button>
      </div>
    </div>
  );
}

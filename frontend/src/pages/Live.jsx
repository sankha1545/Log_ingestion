import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import LogItem from "../components/LogItem/LogItem";
import toast from "react-hot-toast";

export default function Live() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("new_log", (log) => {
      toast.success("New log received");
      setLogs((prev) => [log, ...prev].slice(0, 50));
    });

    return () => socket.off("new_log");
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Live Log Stream</h1>
      <div className="bg-white dark:bg-slate-900 rounded shadow divide-y">
        {logs.length === 0 && (
          <p className="p-4 text-center text-slate-500">
            Waiting for logs...
          </p>
        )}
        {logs.map((log, i) => (
          <LogItem key={i} log={log} />
        ))}
      </div>
    </div>
  );
}

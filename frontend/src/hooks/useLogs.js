import { useEffect, useState, useRef } from "react";
import { fetchLogs } from "../api/logsApi";
import { socket } from "../services/socket";

function matchesFilters(log, filters) {
  if (filters.level && log.level !== filters.level) return false;

  if (filters.message &&
      !log.message.toLowerCase().includes(filters.message.toLowerCase()))
    return false;

  if (filters.resourceId &&
      !log.resourceId.toLowerCase().includes(filters.resourceId.toLowerCase()))
    return false;

  if (filters.timestamp_start &&
      new Date(log.timestamp) < new Date(filters.timestamp_start))
    return false;

  if (filters.timestamp_end &&
      new Date(log.timestamp) > new Date(filters.timestamp_end))
    return false;

  return true;
}

export function useLogs(filters) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const prevIds = useRef(new Set()); // prevent duplicates

  /* -------- REST FETCH (on filter change) -------- */
  useEffect(() => {
    const controller = new AbortController();

    const debounce = setTimeout(() => {
      setLoading(true);
      fetchLogs(filters, controller.signal)
        .then((data) => {
          prevIds.current = new Set(data.map(l => l.timestamp + l.traceId));
          setLogs(data);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [filters]);

  /* -------- REAL-TIME SOCKET LISTENER -------- */
  useEffect(() => {
    const handler = (newLog) => {
      const key = newLog.timestamp + newLog.traceId;

      if (prevIds.current.has(key)) return; // avoid duplicates
      if (!matchesFilters(newLog, filters)) return;

      prevIds.current.add(key);
      setLogs((prev) => [newLog, ...prev]);
    };

    socket.on("new_log", handler);

    return () => {
      socket.off("new_log", handler);
    };
  }, [filters]);

  return { logs, loading };
}

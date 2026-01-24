import { AnimatePresence, motion } from "framer-motion";
import LogItem from "../LogItem/LogItem";

export default function LogsList({ logs, loading, page, setPage }) {
  if (loading) {
    return (
      <p className="p-4 text-center text-slate-500 dark:text-slate-400">
        Loading logs...
      </p>
    );
  }

  if (!logs.length) {
    return (
      <p className="p-4 text-center text-slate-500 dark:text-slate-400">
        No logs found
      </p>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={log.timestamp + i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LogItem log={log} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div
        className="flex justify-between items-center p-3 
        border-t border-slate-200 dark:border-slate-800 
        text-sm bg-slate-50 dark:bg-slate-900"
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded 
            bg-slate-200 dark:bg-slate-800 
            text-slate-800 dark:text-slate-100
            hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          Prev
        </button>

        <span className="text-slate-600 dark:text-slate-400">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded 
            bg-slate-200 dark:bg-slate-800 
            text-slate-800 dark:text-slate-100
            hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </>
  );
}

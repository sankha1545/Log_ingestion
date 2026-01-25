const { z } = require("zod");
const fs = require("fs-extra");
const path = require("path");
const lockfile = require("proper-lockfile");

const LOG_FILE = path.join(__dirname, "../data/logs.json");

/* ----------- SCHEMA ----------- */
const LogSchema = z.object({
  level: z.enum(["error", "warn", "info", "debug"]),
  message: z.string().min(1),
  resourceId: z.string().min(1),
  timestamp: z.string().datetime(),
  traceId: z.string().min(1),
  spanId: z.string().min(1),
  commit: z.string().min(1),
  metadata: z.record(z.any()),
});

/* ----------- POST /logs ----------- */
async function postLogs(req, res) {
  const parsed = LogSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const log = parsed.data;
  let release;

  try {
    if (!(await fs.pathExists(LOG_FILE))) {
      await fs.outputFile(LOG_FILE, "[]");
    }

    release = await lockfile.lock(LOG_FILE, { retries: 5 });

    const raw = await fs.readFile(LOG_FILE, "utf-8");
    const logs = raw ? JSON.parse(raw) : [];

    logs.push(log);

    const temp = LOG_FILE + ".tmp";
    await fs.writeFile(temp, JSON.stringify(logs, null, 2));
    await fs.rename(temp, LOG_FILE);

    await release();

    // real-time emit
    if (req.io) req.io.emit("new_log", log);

    return res.status(201).json(log);
  } catch (err) {
    if (release) await release();
    console.error("Write failed:", err);
    return res.status(500).json({ error: "Failed to save log" });
  }
}

/* ----------- GET /logs ----------- */
async function getLogs(req, res) {
  try {
    if (!(await fs.pathExists(LOG_FILE))) {
      return res.json([]);
    }

    const raw = await fs.readFile(LOG_FILE, "utf-8");
    const logs = raw ? JSON.parse(raw) : [];

    let results = logs;

    const {
      level,
      message,
      search,
      resourceId,
      from,
      to,
      timestamp_start,
      timestamp_end,
      traceId,
      spanId,
      commit,
      caseSensitive,
    } = req.query;

    const msgFilter = search || message;
    const startRaw = from || timestamp_start;
    const endRaw = to || timestamp_end;

    console.log("====== DATE FILTER DEBUG ======");
console.log("FROM RAW:", startRaw);
console.log("TO RAW:", endRaw);

    /* -------- LEVEL FILTER -------- */
    if (level) {
      const levels = String(level).split(",").map((s) => s.trim());
      results = results.filter((l) => levels.includes(l.level));
    }

    /* -------- RESOURCE ID FILTER -------- */
    if (resourceId) {
      const r = String(resourceId).toLowerCase();
      results = results.filter((l) =>
        String(l.resourceId || "").toLowerCase().includes(r)
      );
    }

    /* -------- MESSAGE SEARCH -------- */
    if (msgFilter) {
      const safe = String(msgFilter).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const flags =
        caseSensitive === "1" || caseSensitive === "true" ? "" : "i";
      const regex = new RegExp(safe, flags);

      results = results.filter((l) =>
        regex.test(String(l.message || ""))
      );
    }

    if (traceId) results = results.filter((l) => l.traceId === traceId);
    if (spanId) results = results.filter((l) => l.spanId === spanId);
    if (commit) results = results.filter((l) => l.commit === commit);

    /* -------- TIME RANGE FILTER (FIXED) -------- */
/* -------- TIME RANGE FILTER (FINAL FIX) -------- */
if (startRaw || endRaw) {
  const startTime = startRaw ? new Date(startRaw).getTime() : null;
  const endTime = endRaw
    ? new Date(endRaw).getTime() + 59_999
    : null;

  console.log("PARSED FROM:", startTime);
  console.log("PARSED TO:", endTime);

  results = results.filter((l) => {
    const t = new Date(l.timestamp).getTime();
    if (Number.isNaN(t)) return false;

    if (startTime !== null && t < startTime) return false;
    if (endTime !== null && t > endTime) return false;

    return true;
  });
}



    /* -------- SORT NEWEST FIRST -------- */
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json(results);
  } catch (err) {
    console.error("Read failed:", err);
    return res.status(500).json({ error: "Failed to read logs" });
  }
}

module.exports = { postLogs, getLogs };

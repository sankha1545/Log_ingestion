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
    // ensure file exists
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

    // 🔴 REAL-TIME EMIT
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
      resourceId,
      timestamp_start,
      timestamp_end,
      traceId,
      spanId,
      commit,
    } = req.query;

    // level filter (multi-select)
    if (level) {
      const levels = level.split(",");
      results = results.filter((l) => levels.includes(l.level));
    }

    // resourceId filter
    if (resourceId) {
      results = results.filter((l) =>
        l.resourceId.toLowerCase().includes(resourceId.toLowerCase())
      );
    }

    // message full-text (CASE-SENSITIVE as you asked)
    if (message) {
      const safe = message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe);
      results = results.filter((l) => regex.test(l.message));
    }

    if (traceId) results = results.filter((l) => l.traceId === traceId);
    if (spanId) results = results.filter((l) => l.spanId === spanId);
    if (commit) results = results.filter((l) => l.commit === commit);

    // time range
    if (timestamp_start || timestamp_end) {
      results = results.filter((l) => {
        const t = new Date(l.timestamp).getTime();
        if (timestamp_start && t < new Date(timestamp_start).getTime()) return false;
        if (timestamp_end && t > new Date(timestamp_end).getTime()) return false;
        return true;
      });
    }

    // reverse chronological
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json(results);
  } catch (err) {
    console.error("Read failed:", err);
    return res.status(500).json({ error: "Failed to read logs" });
  }
}

module.exports = { postLogs, getLogs };

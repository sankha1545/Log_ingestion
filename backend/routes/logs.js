const { z } = require("zod");
const fs = require("fs-extra");
const path = require("path");
const lockfile = require("proper-lockfile");

const LOG_FILE = path.join(__dirname, "../data/logs.json");

/* ----------- Log Schema ----------- */
const LogSchema = z.object({
  level: z.enum(["error", "warn", "info", "debug"]),
  message: z.string().min(1),
  resourceId: z.string().min(1),
  timestamp: z.string().datetime(),
  traceId: z.string().min(1),
  spanId: z.string().min(1),
  commit: z.string().min(1),
  metadata: z.record(z.any()).optional(),
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
    release = await lockfile.lock(LOG_FILE, { retries: 5 });

    let logs = [];
    if (await fs.pathExists(LOG_FILE)) {
      const raw = await fs.readFile(LOG_FILE, "utf-8");
      logs = raw ? JSON.parse(raw) : [];
    }

    logs.push(log);

    const temp = LOG_FILE + ".tmp";
    await fs.writeFile(temp, JSON.stringify(logs, null, 2));
    await fs.rename(temp, LOG_FILE);

    release();
    return res.status(201).json({ success: true });
  } catch (err) {
    if (release) await release();
    console.error("Write failed:", err);
    return res.status(500).json({ error: "Failed to save log" });
  }
}

module.exports = { postLogs };

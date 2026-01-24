const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// 🔴 DISABLE ETAG BEFORE ANY MIDDLEWARE
app.disable("etag");

const server = http.createServer(app);
const { postLogs, getLogs } = require("./routes/logs");
const { execCommand } = require("./routes/cli");

app.post("/cli/exec", execCommand);

// ------------------ SOCKET.IO ------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// attach io to req so routes can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ------------------ CACHE KILLER ------------------
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// ------------------ ROUTES ------------------
app.post("/logs", postLogs);
app.get("/logs", getLogs);

// ------------------ SOCKET CONNECTION ------------------
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ------------------ SERVER ------------------
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
});

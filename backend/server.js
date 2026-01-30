const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.disable("etag");

app.use(cors({
  origin: [
    "http://localhost",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// Routes
const { postLogs, getLogs } = require("./routes/logs");
app.post("/logs", postLogs);
app.get("/logs", getLogs);

// Only create server + socket when NOT testing
let server;
let io;

if (process.env.NODE_ENV !== "test") {
  server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  // Make io available to routes
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API + WebSocket running on port ${PORT}`);
  });
}

// Export app for tests
module.exports = app;

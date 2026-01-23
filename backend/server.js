const express = require("express");
const cors = require("cors");
const { postLogs } = require("./routes/logs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/logs", postLogs);

app.listen(3001, () => console.log("API running on http://localhost:3001"));

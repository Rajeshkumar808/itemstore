const express = require("express");
const cors = require("cors");
const path = require("path");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Inventory API is running." });
});

app.use("/api/items", itemRoutes);

// Serve the frontend during local development as well.
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

module.exports = app;

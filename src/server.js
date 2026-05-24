const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "urls.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "{}", "utf-8");
  }
}

function loadData() {
  ensureDataFile();

  const content = fs.readFileSync(dataFile, "utf-8");

  if (!content.trim()) {
    return {};
  }

  return JSON.parse(content);
}

function saveData(data) {
  ensureDataFile();

  const json = JSON.stringify(data, null, 2);

  fs.writeFileSync(dataFile, json, {
    encoding: "utf-8",
    flag: "w"
  });

  console.log("saved:", json);
}

function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API online"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.post("/shorten", (req, res) => {
  const { target } = req.body;

  if (!target) {
    return res.status(400).json({
      error: "target is required"
    });
  }

  const data = loadData();

  const id = generateShortId();

  data[id] = {
    target,
    clicks: 0
  };

  saveData(data);

  res.json({
    shortUrl: id,
    target
  });
});

app.get("/stats", (req, res) => {
  const data = loadData();

  res.json(data);
});

app.get("/:id", (req, res) => {
  const data = loadData();

  const url = data[req.params.id];

  if (!url) {
    return res.status(404).json({
      error: "not found"
    });
  }

  url.clicks += 1;

  saveData(data);

  res.redirect(url.target);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
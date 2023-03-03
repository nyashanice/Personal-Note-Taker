const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// GET /notes route to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET * to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET /api/notes to db.json
app.get("/api/notes", (req, res) => {
  res.json(`${req.method} request received!`);
  console.info(`${req.method} request received!!`);
});

// POST /api/notes to db.json
// receive new note and append to db.json then return new note
// each note should have unique id when saved (use npm package)
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

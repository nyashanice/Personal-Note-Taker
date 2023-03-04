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
app.post("/api/notes", (req, res) => {
  // receive new note and append to db.json then return new note
  const { title, text } = req.body;
  console.log(req.body);

  if (title && text) {
    // each note should have unique id when saved (use npm package)
    const newNote = {
      title,
      text,
      _id: uuid(),
    };

    // const stringifyNote = JSON.stringify(newNote);

    fs.readFile("./db/db.json", "utf8", (err, notes) => {
      if (err) {
        console.error(err);
      } else {
        const parseNotes = JSON.parse(notes);
        parseNotes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(parseNotes), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("success!");
          }
        });
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

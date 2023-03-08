const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.use(express.static("public"));
// GET /notes route to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET * to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET /api/notes to db.json
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(results));
    }
  });
  console.info(`${req.method} request received!!`);
});

// POST /api/notes to db.json
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      _id: uuid(),
    };

    const sendToDb = (file, note) => {
      fs.writeFile(file, JSON.stringify(note, null, 4), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("success!");
        }
      });
    };

    fs.readFile("./db/db.json", "utf8", (err, notes) => {
      if (err) {
        console.error(err);
      } else {
        const parseNotes = JSON.parse(notes);
        parseNotes.push(newNote);
        sendToDb("./db/db.json", parseNotes);
        return parseNotes;
      }
      
    });
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
  }
});

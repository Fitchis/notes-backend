const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.post("/notes", (req, res) => {
  const { title, datetime, note } = req.body;

  if (!title || !datetime || !note) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  db.query(query, [title, datetime, note], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Note created", id: result.insertId });
  });
});

app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM notes WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(results[0]);
  });
});

app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;

  if (!title || !datetime || !note) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?";
  db.query(query, [title, datetime, note, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Note updated" });
  });
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notes WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted" });
  });
});

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

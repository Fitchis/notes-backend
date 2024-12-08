const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
  const { title, datetime, note } = req.body;
  const sql = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  db.query(sql, [title, datetime, note], (err, result) => {
    if (err) throw err;
    res.json({ message: "Note created", id: result.insertId });
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM notes";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM notes WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

router.put("/:id", (req, res) => {
  const { title, datetime, note } = req.body;
  const sql = "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?";
  db.query(sql, [title, datetime, note, req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Note updated" });
  });
});

router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM notes WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Note deleted" });
  });
});

module.exports = router;

const { pool } = require("../config/dbConnection.js");

// Add a new note
const addNote = async (req, res) => {
  const { user_id, note_text } = req.body;

  console.log(note_text);

  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, note_text) VALUES ($1, $2) RETURNING *",
      [user_id, note_text]
    );

    res
      .status(201)
      .json({ message: "Note added successfully", note: result.rows[0] });
  } catch (err) {
    console.error("Error adding note", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notes for a specific user
const getNotes = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching notes", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a note
const updateNote = async (req, res) => {
  const { note_text } = req.body;
  const { note_id } = req.params;

  console.log("note_id", note_id);
  console.log("note_text", note_text);

  try {
    const result = await pool.query(
      "UPDATE notes SET note_text = $1 WHERE note_id = $2 RETURNING *",
      [note_text, note_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note updated successfully", note: result.rows[0] });
  } catch (err) {
    console.error("Error updating note", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  const { note_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE note_id = $1 RETURNING *",
      [note_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
};

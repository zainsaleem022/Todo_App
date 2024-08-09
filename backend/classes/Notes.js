// notes.js
const { pool } = require("../config/dbConnection.js");

class Notes {
  static addNote;
  static getNotes;
  static updateNote;
  static deleteNote;
  static searchNotes;
}

Notes.addNote = async (user_id, note_text) => {
  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, note_text) VALUES ($1, $2) RETURNING *",
      [user_id, note_text]
    );
    return { success: true, note: result.rows[0] };
  } catch (err) {
    console.error("Error adding note", err);
    return { success: false, error: "Internal server error" };
  }
};

Notes.getNotes = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return { success: true, notes: result.rows };
  } catch (err) {
    console.error("Error fetching notes", err);
    return { success: false, error: "Internal server error" };
  }
};

Notes.updateNote = async (note_id, note_text) => {
  try {
    const result = await pool.query(
      "UPDATE notes SET note_text = $1 WHERE note_id = $2 RETURNING *",
      [note_text, note_id]
    );
    if (result.rows.length === 0) {
      return { success: false, error: "Note not found" };
    }
    return { success: true, note: result.rows[0] };
  } catch (err) {
    console.error("Error updating note", err);
    return { success: false, error: "Internal server error" };
  }
};

Notes.deleteNote = async (note_id) => {
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE note_id = $1 RETURNING *",
      [note_id]
    );
    if (result.rows.length === 0) {
      return { success: false, error: "Note not found" };
    }
    return { success: true };
  } catch (err) {
    console.error("Error deleting note", err);
    return { success: false, error: "Internal server error" };
  }
};

Notes.searchNotes = async (user_id, query) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 AND note_text ILIKE $2 ORDER BY created_at DESC",
      [user_id, `%${query}%`]
    );
    return { success: true, notes: result.rows };
  } catch (err) {
    console.error("Error searching notes", err);
    return { success: false, error: "Internal server error" };
  }
};

module.exports = Notes;

module.exports = Notes;

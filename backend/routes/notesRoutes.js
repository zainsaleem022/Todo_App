const express = require("express");
const router = express.Router();
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notesController.js");
const protect = require("../config/verifyUser.js");

// Add a new note
router.post("/", protect, addNote);

// Get all notes for a specific user
router.get("/:user_id", protect, getNotes);

// Update a note
router.put("/:note_id", protect, updateNote);

// Delete a note
router.delete("/:note_id", protect, deleteNote);

module.exports = router;

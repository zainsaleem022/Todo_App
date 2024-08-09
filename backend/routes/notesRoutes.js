const express = require("express");
const router = express.Router();
const createNotesController = require("../factory/notesFactory.js");
const protect = require("../config/verifyUser.js");

const notesController = createNotesController();

// Add a new note
router.post("/", protect, (req, res) => notesController.addNote(req, res));

// Get all notes for a specific user
router.get("/:user_id", protect, (req, res) =>
  notesController.getNotes(req, res)
);

// Update a note
router.put("/:note_id", protect, (req, res) =>
  notesController.updateNote(req, res)
);

// Delete a note
router.delete("/:note_id", protect, (req, res) =>
  notesController.deleteNote(req, res)
);

// Search notes for a specific user
router.get("/search/:user_id", protect, (req, res) =>
  notesController.searchNotes(req, res)
);

module.exports = router;

// notesControllerFactory.js
const Notes = require("../classes/Notes");
const NotesController = require("../controllers/notesController");

// Create a factory function
const createNotesController = () => {
  return new NotesController(Notes);
};

module.exports = createNotesController;

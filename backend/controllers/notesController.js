// NotesController.js
class NotesController {
  constructor(Notes) {
    this.Notes = Notes;
  }

  async addNote(req, res) {
    const { user_id, note_text } = req.body;

    if (!user_id || !note_text) {
      return res
        .status(400)
        .json({ message: "User ID and note text are required" });
    }

    const result = await this.Notes.addNote(user_id, note_text);

    if (result.success) {
      res
        .status(201)
        .json({ message: "Note added successfully", note: result.note });
    } else {
      res.status(500).json({ message: result.error });
    }
  }

  async getNotes(req, res) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await this.Notes.getNotes(user_id);

    if (result.success) {
      res.status(200).json(result.notes);
    } else {
      res.status(500).json({ message: result.error });
    }
  }

  async updateNote(req, res) {
    const { note_text } = req.body;
    const { note_id } = req.params;

    if (!note_id || !note_text) {
      return res
        .status(400)
        .json({ message: "Note ID and note text are required" });
    }

    const result = await this.Notes.updateNote(note_id, note_text);

    if (result.success) {
      res
        .status(200)
        .json({ message: "Note updated successfully", note: result.note });
    } else {
      res
        .status(result.error === "Note not found" ? 404 : 500)
        .json({ message: result.error });
    }
  }

  async deleteNote(req, res) {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    const result = await this.Notes.deleteNote(note_id);

    if (result.success) {
      res.status(200).json({ message: "Note deleted successfully" });
    } else {
      res
        .status(result.error === "Note not found" ? 404 : 500)
        .json({ message: result.error });
    }
  }

  async searchNotes(req, res) {
    const { user_id } = req.params;
    const { query } = req.query;

    if (!user_id || !query) {
      return res
        .status(400)
        .json({ message: "User ID and search query are required" });
    }

    const result = await this.Notes.searchNotes(user_id, query);

    if (result.success) {
      res.status(200).json(result.notes);
    } else {
      res.status(500).json({ message: result.error });
    }
  }
}

module.exports = NotesController;

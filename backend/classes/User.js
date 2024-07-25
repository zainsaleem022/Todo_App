const { pool } = require("../config/dbConnection.js");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        "SELECT * FROM todo_users WHERE email = $1",
        [email]
      );
      return result.rows[0] || null;
    } catch (err) {
      throw new Error("Error finding user by email");
    }
  }

  static async create({ name, email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO todo_users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error("Error creating new user");
    }
  }
}

module.exports = User;

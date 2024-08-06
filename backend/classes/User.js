// user.js
const { pool } = require("../config/dbConnection.js");
const argon2 = require("argon2");

class User {
  static findByEmail;
  static create;
  static removeByEmail;
}

User.findByEmail = async (email) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todo_users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error("Error finding user by email");
  }
};

User.create = async ({ name, email, password }) => {
  try {
    const hashedPassword = await argon2.hash(password);
    const result = await pool.query(
      "INSERT INTO todo_users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error("Error creating new user");
  }
};

User.removeByEmail = async (email) => {
  try {
    const result = await pool.query(
      "DELETE FROM todo_users WHERE email = $1 RETURNING *",
      [email]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error("Error removing user by email");
  }
};

module.exports = User;

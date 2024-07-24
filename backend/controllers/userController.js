const { pool } = require("../config/dbConnection.js");
const generateToken = require("../config/generateToken.js");
const bcrypt = require("bcrypt");

exports.getHomePage = (req, res) => {
  res.send("Welcome to the home page!");
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM todo_users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      let user = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = generateToken(user.name, user.email);
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;

        res.status(200).json({ message: "Login successful", user, token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const newPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO todo_users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, newPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.name, user.email);
    const { password, ...userWithoutPassword } = user;
    res
      .status(201)
      .json({ message: "Signup successful", userWithoutPassword, token });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleGoogleLoginFailure = (req, res) => {
  res.status(401).json({
    error: true,
    message: "Google Log in Failure",
  });
};

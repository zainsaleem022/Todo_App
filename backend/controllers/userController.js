const generateToken = require("../config/generateToken.js");
const bcrypt = require("bcrypt");

class UserController {
  constructor(User) {
    this.User = User;
  }

  getHomePage(req, res) {
    res.send("Welcome to the home page!");
  }

  async signIn(req, res) {
    const { email, password } = req.body;

    try {
      const user = await this.User.findByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user.name, user.email);
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
          message: "Login successful",
          user: userWithoutPassword,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Error signing in", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async signUp(req, res) {
    const { name, email, password } = req.body;

    try {
      const user = await this.User.create({ name, email, password });
      const token = generateToken(user.name, user.email);
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({
        message: "Signup successful",
        user: userWithoutPassword,
        token,
      });
    } catch (err) {
      console.error("Error signing up", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  handleGoogleLoginFailure(req, res) {
    res.status(401).json({
      error: true,
      message: "Google Log in Failure",
    });
  }

  handleGoogleCallback(req, res) {
    res.redirect("http://localhost:3001/?success=true"); // Redirect to signup with a success query
  }

  handleGoogleLoginSuccess(req, res) {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "User has successfully authenticated",
        user: req.user,
      });
    } else {
      res.status(403).json({ success: false, message: "Not authorized" });
    }
  }
}

module.exports = UserController;

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/dbConnection.js");
const userRoutes = require("./routes/userRoutes.js");
const notesRoutes = require("./routes/notesRoutes.js");
const session = require("express-session");
const passportSetup = require("./config/passport.js");
const passport = require("passport");

dotenv.config();
const app = express();
connectDB();
app.use(express.json()); //to accept JSON data

app.use(
  cors({
    origin: "http://localhost:3001", // your frontend domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Initialize session middleware
app.use(
  session({
    secret: "zain",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // In production, set secure: true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRoutes);
app.use("/todo", notesRoutes);

app.get("/", (req, res) => {
  res.send("Hello World").status(200);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect to frontend with user info.
    res.redirect("http://localhost:3001/?success=true"); // Redirect to signup with a success query
  }
);

app.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User has successfully authenticated",
      user: req.user,
    });
  } else {
    res.status(403).json({ success: false, message: "Not authorized" });
  }
});

module.exports = app;

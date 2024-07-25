const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("../config/passport.js");
const createUserController = require("../factory/userFactory.js"); // Adjust the path as necessary

// Initialize session middleware
router.use(
  session({
    secret: "zain",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // In production, set secure: true if using HTTPS
  })
);

router.use(passport.initialize());
router.use(passport.session());

const userController = createUserController();

router.get("/", (req, res) => userController.getHomePage(req, res));
router.post("/signin", (req, res) => userController.signIn(req, res));
router.post("/signup", (req, res) => userController.signUp(req, res));
router.get("/auth/login/failed", (req, res) =>
  userController.handleGoogleLoginFailure(req, res)
);

// Google authentication routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => userController.handleGoogleCallback(req, res)
);

router.get("/auth/login/success", (req, res) =>
  userController.handleGoogleLoginSuccess(req, res)
);

module.exports = router;

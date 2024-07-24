const express = require("express");
const router = express.Router();
const {
  signIn,
  signUp,
  getHomePage,
  handleGoogleLoginFailure,
} = require("../controllers/userController.js");

router.get("/", getHomePage);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/auth/login/failed", handleGoogleLoginFailure);

module.exports = router;

// middleware/protect.js

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // console.log("verifying user")

  // Check if the token is in the Authorization header and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      // console.log("JWT SECRET", process.env.JWT_SECRET)

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user information to the request object
      req.user = {
        name: decoded.name,
        email: decoded.email,
      };

      next(); // Continue to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;

const User = require("../classes/User"); // Adjust the path as necessary
const UserController = require("../controllers/userController");

function createUserController() {
  return new UserController(User);
}

module.exports = createUserController;

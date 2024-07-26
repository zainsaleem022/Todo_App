const User = require("../classes/User");
const UserController = require("../controllers/userController");

function createUserController() {
  return new UserController(User);
}

module.exports = createUserController;

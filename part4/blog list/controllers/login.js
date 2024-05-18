const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const user = await User.findOne({ username: request.body.username });
  const passwordCorrect =
    user === null
      ? false
      : bcrypt.compare(request.body.password, user.hashedPassword);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET_TOKEN);

  response
    .status(200)
    .send({ username: user.username, name: user.name, token });
});

module.exports = loginRouter;

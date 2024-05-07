const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.post("/", async (request, response) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({ ...request.body, hashedPassword: hashedPassword });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;

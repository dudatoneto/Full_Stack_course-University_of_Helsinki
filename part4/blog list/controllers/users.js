const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const user = await User.find({});
  response.status(200).json(user);
});

usersRouter.post("/", async (request, response) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({ ...request.body, hashedPassword: hashedPassword });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;

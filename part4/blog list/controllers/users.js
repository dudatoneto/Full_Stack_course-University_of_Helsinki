const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const user = await User.find({});
  response.status(200).json(user);
});

usersRouter.post("/", async (request, response) => {
  if (!request.body.username || !request.body.password) {
    console.log("username or password is missing");
    return response
      .status(400)
      .json({ error: "username or password is missing" });
  }

  if (request.body.password.length < 3 || request.body.username.length < 3) {
    console.log("username and password should be at least 3 characters long");
    return response
      .status(400)
      .json({ error: "username and password should be at least 3 characters long" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({ ...request.body, hashedPassword: hashedPassword });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;

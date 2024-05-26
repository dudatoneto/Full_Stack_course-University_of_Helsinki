const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const config = require("../utils/config");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  result = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(result);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const decodedToken = jwt.verify(request.token, config.SECRET_TOKEN);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);

  const blogData = {
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  };
  const blog = new Blog(blogData);
  await blog.save();

  // adding the new blog id to the list of blogs of the user
  user.blogs = user.blogs.concat(blog.id);
  await user.save();

  response.status(201).json(blog);
});

blogsRouter.put("/:id", async (request, response) => {
  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    { $inc: { likes: 1 } },
    { new: true, runValidators: true, context: "query" }
  );

  if (result) {
    console.log(
      `Updated the likes of the blog with the id ${request.params.id}`
    );
    response.status(200).json(result);
  } else {
    console.log(`There is no blog with the id ${request.params.id}`);
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id);
  if (result) {
    console.log(`Blog with the id ${request.params.id} deleted`);
    response.status(204).end();
  } else {
    console.log(`There is no blog with the id ${request.params.id}`);
    response.status(404).end();
  }
});

module.exports = blogsRouter;

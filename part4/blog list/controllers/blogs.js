const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  result = await Blog.find({});
  response.json(result);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  await blog.save();
  response.status(201).json(blog);
});

module.exports = blogsRouter;

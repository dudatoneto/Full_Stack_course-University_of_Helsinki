const blogsRouter = require("express").Router();
const { request, response } = require("../app");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  result = await Blog.find({});
  response.json(result);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const blogData = {
    ...request.body,
    likes: request.body.likes || 0,
  };
  const blog = new Blog(blogData);

  await blog.save();
  response.status(201).json(blog);
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

const { test, after, beforeEach, expect, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog");
const { insertMany } = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  new Blog({
    title: "The Eras Tour",
    author: "Taylor Swift",
    url: "https://www.taylorswift.com/tour/",
    likes: 5,
  }),
  new Blog({
    title: "official website",
    author: "Taylor Swift",
    url: "https://www.taylorswift.com",
    likes: 13,
  }),
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("get requests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, 2);
  });

  test("blog posts have unique identifier property named id", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });
});

describe("post requests", () => {
  test("making a post request successfully creates a blog post", async () => {
    const newBlog = {
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(titles.includes("test title"));
  });

  test("making a post request that does not have the likes property creates a blog post with 0 likes", async () => {
    const newBlog = {
      author: "test",
      title: "test title",
      url: "https://www.test.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const blogs = response.body.filter((blog) => blog.title == "test title");

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert.strictEqual(blogs[0].likes, 0);
  });

  test("making a post request that does not have the title property returns a 400 response", async () => {
    const newBlog = {
      author: "test",
      url: "https://www.test.com",
      likes: "3",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("making a post request that does not have the url property returns a 400 response", async () => {
    const newBlog = {
      author: "test",
      title: "test title",
      likes: "3",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("delete requests", () => {
  test("making a dele request successfully deletes a blog with the specified id", async () => {
    const newBlog = new Blog({
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    });

    await newBlog.save();

    let response = await api.get("/api/blogs");

    let blogs = response.body.filter((blog) => blog.title == "test title");

    await api.delete(`/api/blogs/${blogs[0].id}`).expect(204);

    response = await api.get("/api/blogs");

    blogs = response.body.filter((blog) => blog.title == "test title");

    assert.strictEqual(response.body.length, initialBlogs.length);
    assert.strictEqual(blogs.length, 0);
  });

  test("making a delete request with an id that does not match with any blogs", async () => {
    const newBlog = new Blog({
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    });

    newBlog.save();
    let response = await api.get("/api/blogs");
    const blogs = await response.body.filter((blog) => blog.title == "test title");

    await api.delete(`/api/blogs/${blogs[0].id}`).expect(204);

    await api.delete(`/api/blogs/${blogs[0].id}`).expect(404);

    response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog");

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

describe("GET requests", () => {
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

describe("POST requests", () => {
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

    const response = await Blog.find({});
    const responsePostedBlog = await Blog.find({ title: "test title" });

    assert.strictEqual(response.length, initialBlogs.length + 1);
    assert.strictEqual(responsePostedBlog.length, 1);
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

    const responseBlogs = await Blog.find({});
    const responsePostedBlog = await Blog.find({ title: "test title" });

    assert.strictEqual(responseBlogs.length, initialBlogs.length + 1);
    assert.strictEqual(responsePostedBlog[0].likes, 0);
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

describe("DELETE requests", () => {
  test("making a delete request successfully deletes a blog with the specified id", async () => {
    const newBlog = new Blog({
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    });

    await newBlog.save();
    const responseNotUpdated = await Blog.find({ title: "test title" });

    await api.delete(`/api/blogs/${responseNotUpdated[0].id}`).expect(204);

    const responseBlogs = await Blog.find({});
    const responseDeletedBlog = await Blog.find({ title: "test title" });

    assert.strictEqual(responseBlogs.length, initialBlogs.length);
    assert.strictEqual(responseDeletedBlog.length, 0);
  });

  test("making a delete request with an id that does not match with any blogs returns a 404 response", async () => {
    const newBlog = new Blog({
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    });

    await newBlog.save();
    let response = await Blog.find({ title: "test title" });

    await api.delete(`/api/blogs/${response[0].id}`).expect(204);

    await api.delete(`/api/blogs/${response[0].id}`).expect(404);

    response = await Blog.find({});

    assert.strictEqual(response.length, initialBlogs.length);
  });
});

describe("PUT requests", () => {
  test("making a put request increases by 1 the likes of a blog with the specified id", async () => {
    const responseNotUpdated = await Blog.find({ title: "The Eras Tour" });

    await api.put(`/api/blogs/${responseNotUpdated[0].id}`).expect(200);

    const responseUpdated = await Blog.find({ title: "The Eras Tour" });

    assert.deepStrictEqual(
      responseNotUpdated[0].likes + 1,
      responseUpdated[0].likes
    );
  });

  test("making a put request with an id that does not match with any blogs returns a 404 response", async () => {
    const newBlog = new Blog({
      author: "test",
      title: "test title",
      url: "https://www.test.com",
      likes: "3",
    });

    await newBlog.save();
    const response = await Blog.find({ title: "test title" });
    await Blog.findByIdAndDelete(response[0].id);

    await api.put(`/api/blogs/${response[0].id}`).expect(404);
  });
});

after(async () => {
  await mongoose.connection.close();
});

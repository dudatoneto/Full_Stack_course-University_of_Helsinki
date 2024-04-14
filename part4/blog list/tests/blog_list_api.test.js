const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "The Eras Tour",
    author: "Taylor Swift",
    url: "https://www.taylorswift.com/tour/",
    likes: 5,
  },
  {
    title: "official website",
    author: "Taylor Swift",
    url: "https://www.taylorswift.com",
    likes: 13,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

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
    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
  });
});

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

  const blog = response.body.filter((blog) => blog.title == "test title");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  assert.strictEqual(blog.likes, 0);
});

after(async () => {
  await mongoose.connection.close();
});

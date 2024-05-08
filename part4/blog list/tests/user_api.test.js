const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const initialUsers = [
  new User({
    username: "taylorswift",
    name: "Taylor Swift",
    password: "taylor123",
  }),
  new User({
    username: "user1",
    name: "User 1",
    password: "123456",
  }),
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

describe("GET requests", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two users", async () => {
    const response = await api.get("/api/users");
    assert.strictEqual(response.body.length, 2);
  });

  test("users have unique identifier property named id", async () => {
    const response = await api.get("/api/users");
    response.body.forEach((user) => {
      assert.ok(user.id);
      assert.strictEqual(user._id, undefined);
    });
  });
});

describe("POST requests", () => {
  test("making a post request successfully creates a user", async () => {
    const newUser = {
      username: "user2",
      name: "User 2",
      password: "test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await User.find({});
    const responsePostedUser = await User.findOne({ username: "user2" });

    assert.strictEqual(response.length, initialUsers.length + 1);
    assert.notStrictEqual(responsePostedUser.length, null);
  });

  test("making a post request that does not have the username property returns a 400 response", async () => {
    const newUser = {
      name: "User 2",
      password: "test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect((res) =>
        assert.strictEqual(res.body.error, "username or password is missing")
      );
  });

  test("making a post request that does not have the password property returns a 400 response", async () => {
    const newUser = {
      username: "user2",
      name: "User 2",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect((res) =>
        assert.strictEqual(res.body.error, "username or password is missing")
      );
  });

  test("making a post request that does not have at least 3 characters for the username property returns a 400 response", async () => {
    const newUser = {
      username: "12",
      name: "User 2",
      password: "test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect((res) =>
        assert.strictEqual(
          res.body.error,
          "username and password should be at least 3 characters long"
        )
      );
  });
  
  test("making a post request that does not have at least 3 characters for the password property returns a 400 response", async () => {
    const newUser = {
      username: "user2",
      name: "User 2",
      password: "12",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect((res) =>
        assert.strictEqual(
          res.body.error,
          "username and password should be at least 3 characters long"
        )
      );
  });

  test("making a post request that has a username that is already in the database returns a 400 response", async () => {
    const newUser = {
      username: "user1",
      name: "User 2",
      password: "test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        assert.strictEqual(res.body.error, "unique constraint violated");
        assert.deepEqual(res.body.properties, ["username"]);
      });
  });
});

after(async () => {
  await mongoose.connection.close();
});

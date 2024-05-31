const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const config = require("../utils/config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const INITIAL_USERS = [
  new User({
    username: "taylorswift",
    name: "Taylor Swift",
    hashedPassword:
      "$2b$10$padbMKf29c4FmTCqIquf8.cQrfOEZnyculCOVj7KfMqRtmskArJgy",
    blogs: [],
  }),
  new User({
    username: "user1",
    name: "User 1",
    hashedPassword:
      "$2b$10$ZblLAAPWCsoUxgDJsak9i.WcaD8qj5ihmoOXrKu6zgrxta9gtp4G.",
    blogs: [],
  }),
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(INITIAL_USERS);
});

describe("POST requests", () => {
  test("username, name and token are returned for a successful request", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: INITIAL_USERS[0].username,
        password: "taylorswift13",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const decodedToken = jwt.verify(response.body.token, config.SECRET_TOKEN);

    assert.deepEqual(decodedToken, {
      username: INITIAL_USERS[0].username,
      id: INITIAL_USERS[0]._id.toString(),
      iat: decodedToken.iat, // include iat to handle the issued at time
    });

    assert.deepEqual(response.body, {
      username: "taylorswift",
      name: "Taylor Swift",
      token: response.body.token,
    });
  });

  test("username, name and token are returned for a successful request (2)", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: INITIAL_USERS[1].username,
        password: "123456",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const decodedToken = jwt.verify(response.body.token, config.SECRET_TOKEN);

    assert.deepEqual(decodedToken, {
      username: INITIAL_USERS[1].username,
      id: INITIAL_USERS[1]._id.toString(),
      iat: decodedToken.iat, // include iat to handle the issued at time
    });

    assert.deepEqual(response.body, {
      username: "user1",
      name: "User 1",
      token: response.body.token,
    });
  });

  test("giving the wrong password returns the status unauthorized", async () => {
    await api
      .post("/api/login")
      .send({
        username: INITIAL_USERS[1].username,
        password: "11111111",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("giving a username that does not exists returns the status unauthorized", async () => {
    await api
      .post("/api/login")
      .send({
        username: "user2",
        password: "123456",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

after(async () => {
  await mongoose.connection.close();
});

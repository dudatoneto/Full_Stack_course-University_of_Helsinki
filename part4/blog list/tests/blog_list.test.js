const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("array of many elements", () => {
    const blogs = [
      { author: "test1", title: "title1", url: "https://test1.com", likes: 1 },
      { author: "test2", title: "title2", url: "https://test2.com", likes: 2 },
      { author: "test3", title: "title3", url: "https://test3.com", likes: 3 },
    ];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 6);
  });

  test("empty list", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test("array of only one element"),
    () => {
      const blogs = [
        {
          author: "test1",
          title: "title1",
          url: "https://test1.com",
          likes: 1,
        },
      ];
      const result = listHelper.totalLikes(blogs);
      assert.strictEqual(result, 1);
    };
});

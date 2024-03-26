const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("list of many elements", () => {
    const blogs = [
      { author: "test1", title: "title1", url: "https://test1.com", likes: 1 },
      { author: "test2", title: "title2", url: "https://test2.com", likes: 2 },
      { author: "test3", title: "title3", url: "https://test3.com", likes: 3 },
    ];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 6);
  });

  test("empty list", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("list of only one element"),
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

describe("favorite blog", () => {
  test("list of many elements", () => {
    const blogs = [
      { author: "test1", title: "title1", url: "https://test1.com", likes: 1 },
      { author: "test2", title: "title2", url: "https://test2.com", likes: 2 },
      { author: "test3", title: "title3", url: "https://test3.com", likes: 3 },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      author: "test3",
      title: "title3",
      url: "https://test3.com",
      likes: 3,
    });
  });

  test("empty list", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, "no blogs in the list!");
  });

  test("list of only one element", () => {
    const blogs = [
      { author: "test1", title: "title1", url: "https://test1.com", likes: 1 },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      author: "test1",
      title: "title1",
      url: "https://test1.com",
      likes: 1,
    });
  });
});

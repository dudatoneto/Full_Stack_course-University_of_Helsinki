const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const EMPTY_LIST = [];
const ONE_BLOG_LIST = [
  {
    author: "test1",
    title: "title1",
    url: "https://test1.com",
    likes: 1,
  },
];
const MANY_BLOGS_LIST = [
  { author: "test1", title: "title1.0", url: "https://test1.com", likes: 1 },
  { author: "test2", title: "title2.0", url: "https://test2.com", likes: 2 },
  { author: "test3", title: "title3.0", url: "https://test3.com", likes: 3 },
  { author: "test4", title: "title4.0", url: "https://test4.com", likes: 4 },
  { author: "test1", title: "title1.1", url: "https://test1.com", likes: 1 },
  { author: "test2", title: "title2.1", url: "https://test2.com", likes: 2 },
  { author: "test3", title: "title3.1", url: "https://test3.com", likes: 3 },
  { author: "test1", title: "title1.2", url: "https://test1.com", likes: 1 },
  { author: "test2", title: "title2.2", url: "https://test2.com", likes: 2 },
];

test("dummy returns one", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("empty list", () => {
    const result = listHelper.totalLikes(EMPTY_LIST);
    assert.strictEqual(result, 0);
  });

  test("list of only one blog", () => {
    const result = listHelper.totalLikes(ONE_BLOG_LIST);
    assert.strictEqual(result, ONE_BLOG_LIST[0].likes);
  });

  test("list of many blogs", () => {
    const result = listHelper.totalLikes(MANY_BLOGS_LIST);
    assert.strictEqual(result, 19);
  });
});

describe("favorite blog", () => {
  test("empty list", () => {
    const result = listHelper.favoriteBlog(EMPTY_LIST);
    assert.strictEqual(result, "no blogs in the list!");
  });

  test("list of only one blog", () => {
    const result = listHelper.favoriteBlog(ONE_BLOG_LIST);
    assert.deepStrictEqual(result, ONE_BLOG_LIST[0]);
  });

  test("list of many blogs", () => {
    const result = listHelper.favoriteBlog(MANY_BLOGS_LIST);
    assert.deepStrictEqual(result, {
      author: "test4",
      title: "title4.0",
      url: "https://test4.com",
      likes: 4,
    });
  });
});

describe("author with most blogs", () => {
  test("empty list", () => {
    const result = listHelper.mostBlogs(EMPTY_LIST);
    assert.strictEqual(result, "no blogs in the list!");
  });

  test("list of only one blog", () => {
    const result = listHelper.mostBlogs(ONE_BLOG_LIST);
    assert.deepStrictEqual(result, { author: "test1", blogs: 1 });
  });

  test("list of many blogs", () => {
    const result = listHelper.mostBlogs(MANY_BLOGS_LIST);
    assert.deepStrictEqual(result, { author: "test1", blogs: 3 });
  });
});

describe("author with most likes", () => {
  test("empty list", () => {
    const result = listHelper.mostLikes(EMPTY_LIST);
    assert.strictEqual(result, "no blogs in the list!");
  });

  test("list of only one blog", () => {
    const result = listHelper.mostLikes(ONE_BLOG_LIST);
    assert.deepStrictEqual(result, { author: "test1", likes: 1 });
  });

  test("list of many blogs", () => {
    const result = listHelper.mostLikes(MANY_BLOGS_LIST);
    assert.deepStrictEqual(result, { author: "test2", likes: 6 });
  });
});

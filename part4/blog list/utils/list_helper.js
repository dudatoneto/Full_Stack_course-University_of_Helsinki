const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  blogs.forEach((blog) => {
    total += blog.likes;
  });
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length != 0) {
    let maxLikes = { ...blogs[0] };
    blogs.forEach((blog) => {
      if (blog.likes > maxLikes.likes) {
        maxLikes = { ...blog };
      }
    });
    return maxLikes;
  } else return "no blogs in the list!";
};

const mostBlogs = (blogs) => {
  let blogsObject = {};
  let authorWithMostBlogs = {};
  authorWithMostBlogs.blogs = 0;

  blogs.forEach((blog) => {
    if (blogsObject.hasOwnProperty(blog.author)) blogsObject[blog.author]++;
    else blogsObject[blog.author] = 1;
  });

  for (let author in blogsObject) {
    if (blogsObject[author] > authorWithMostBlogs.blogs) {
      authorWithMostBlogs.author = author;
      authorWithMostBlogs.blogs = blogsObject[author];
    }
  }

  if (authorWithMostBlogs.author) return authorWithMostBlogs;
  else return "no blogs in the list!";
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};

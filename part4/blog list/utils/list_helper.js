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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

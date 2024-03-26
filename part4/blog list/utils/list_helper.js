const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  total = 0;
  blogs.forEach((blog) => {
    total += blog.likes;
  });
  return total;
};

module.exports = {
  dummy,
  totalLikes,
};

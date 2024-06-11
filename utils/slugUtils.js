const slugify = require('slugify');

const generateSlug = (title, existingPosts) => {
  let baseSlug = slugify(title, {
    replacement: '-',
    lower: true,
    strict: true,
  });
  let slugs = existingPosts.map((post) => post.slug);
  let counter = 1;
  let uniqueSlug = baseSlug;

  while (slugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

module.exports = generateSlug;

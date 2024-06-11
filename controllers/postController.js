const { PrismaClient } = require('@prisma/client');
const generateSlug = require('../utils/slugUtils');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
  const { title, content, img, categoryId, tags } = req.body;

  try {
    const posts = await prisma.post.findMany();
    const slug = generateSlug(title, posts);

    const newPost = {
      title,
      content,
      slug,
      img,
      published: req.body.published ? true : false,
      tags: {
        connect: tags.map((id) => ({ id })),
      },
    };

    if (categoryId) {
      newPost.categoryId = categoryId;
    }

    const post = await prisma.post.create({ data: newPost });
    res.status(200).send(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send(`Post with slug ${slug} not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const listPosts = async (req, res) => {
  try {
    const { published, keyword } = req.query;
    const filter = {};
    if (published === 'true') {
      filter.published = true;
    } else if (published === 'false') {
      filter.published = false;
    }

    if (keyword) {
      filter.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }
    const posts = await prisma.post.findMany({
      where: filter,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    if (posts.length === 0) {
      res.json(`No posts found`);
    } else {
      res.json({ posts });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const updatedPost = req.body;

    if (updatedPost.title) {
      const posts = await prisma.post.findMany();
      const newSlug = generateSlug(updatedPost.title, posts);
      updatedPost.slug = newSlug;
    }

    const post = await prisma.post.update({
      where: { slug },
      data: updatedPost,
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    await prisma.post.delete({
      where: { slug },
    });
    res.json(`Post with slug ${slug} successfully deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPost,
  getPost,
  listPosts,
  updatePost,
  deletePost,
};

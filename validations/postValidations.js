const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postSchema = {
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Title is required.',
      bail: true,
    },
    isString: {
      errorMessage: 'Title must be a string.',
      bail: true,
    },
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 },
    },
  },
  img: {
    in: ['body'],
    optional: {
      options: { nullable: true },
    },
    isString: {
      errorMessage: 'Image must be a string.',
      bail: true,
    },
    matches: {
      options: [/\.(jpg|jpeg|png|gif)$/i],
      errorMessage: 'Image must have a valid extension (jpg, jpeg, png, gif).',
    },
  },
  content: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Content is required.',
      bail: true,
    },
    isString: {
      errorMessage: 'Content must be a string.',
      bail: true,
    },
    isLength: {
      errorMessage: 'Content must be at least 3 characters long.',
      options: { min: 3 },
    },
  },
  published: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'Published must be a boolean.',
    },
  },
  categoryId: {
    in: ['body'],
    isInt: {
      errorMessage: 'Category ID must be an integer.',
      bail: true,
    },
    custom: {
      options: async (value) => {
        const category = await prisma.category.findUnique({
          where: { id: parseInt(value) },
        });
        if (!category) {
          throw new Error(`No category found with ID ${value}.`);
        }
        return true;
      },
    },
  },
  tags: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Tags are required.',
      bail: true,
    },
    isArray: {
      errorMessage: 'Tags must be an array.',
    },
    custom: {
      options: async (tagsArray) => {
        if (tagsArray.length === 0) {
          throw new Error(`A post must have at least one tag.`);
        }
        const invalidId = tagsArray.find((id) => isNaN(parseInt(id)));
        if (invalidId) {
          throw new Error(`One or more IDs are not integers.`);
        }
        const tags = await prisma.tag.findMany({
          where: { id: { in: tagsArray } },
        });
        if (tags.length !== tagsArray.length) {
          throw new Error(`One or more specified tags do not exist.`);
        }
        return true;
      },
    },
  },
};

module.exports = {
  postSchema,
};

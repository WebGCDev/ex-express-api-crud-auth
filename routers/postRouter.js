const express = require('express');
const router = express.Router();
const {
  createPost,
  getPost,
  listPosts,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const validate = require('../middlewares/validationMiddleware');
const { postSchema } = require('../validations/postValidations');

const authenticate = require('../middlewares/authMiddleware');

// router.use(authenticate);

router.post('/', validate(postSchema), createPost);
router.get('/:slug', getPost);
router.get('/', listPosts);
router.put('/:slug', validate(postSchema), updatePost);
router.delete('/:slug', deletePost);

module.exports = router;

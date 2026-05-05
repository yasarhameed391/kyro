const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author').sort('-createdAt');
  res.json(posts);
});

router.post('/', async (req, res) => {
  const post = await Post.create({
    ...req.body,
    author: req.user.id
  });
  res.status(201).json(post);
});

router.post('/:id/like', async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  );
  res.json(post);
});

module.exports = router;

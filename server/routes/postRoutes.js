const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts); //get all posts
router.get('/limit-posts/:limit', postController.getLimitPosts); //delete post
router.post('/', postController.createPost); //create post //checked
router.get('/:id', postController.getPost); //get post
router.put('/:id', postController.updatePost); //update post
router.delete('/:id', postController.deletePost); //delete post
router.delete('/search/:searchTerm/:limit/:sort/:category', postController.getSearchPost); //delete post

module.exports = router;

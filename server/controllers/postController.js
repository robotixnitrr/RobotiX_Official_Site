const Post = require('../models/post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLimitPosts = async (req, res) => {
    try {
        const posts = await Post.find().limit(req.params.limit);
        console.log("limitposts", posts);
        res.json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        console.log(req.body);

        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
};

exports.getSearchPost = async (req, res) => {
    try {
        const post = await Post.find({
            $or: [ // Search in multiple fields (e.g., title and content)
                { title: { $regex: req.params.searchTerm, $options: 'i' } },  // 'i' for case-insensitive search
                { content: { $regex: req.params.searchTerm, $options: 'i' } }
            ]
        }).sort(req.sort).limit;
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

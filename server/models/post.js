const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: false },
    category: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
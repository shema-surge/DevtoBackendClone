const mongoose = require('mongoose');

//schema = blueprint of post (it must contain title, image, etc.)
const Schema = mongoose.Schema;

//model - based on schema - each instance is a new document
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  coverImg: {
    type: String
  },
  body: {
    type: String,
    required: true,
  },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  date: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Comment' }],
  author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Post', postSchema); //returns a constructor function

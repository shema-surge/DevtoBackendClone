const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  avatar: { type: String },
  bio: { type: String },
  links: { type: String },
  joinDate: { type: Date, default: Date.now },
  location: { type: String },
  work: { type: String },
  skills: { type: String },
  following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  followedTags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
});

userSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(this.password,salt)
  this.password = hash
})

module.exports = mongoose.model('User', userSchema);

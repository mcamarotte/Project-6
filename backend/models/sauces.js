const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  userLiked: { type: Array, default: [] },
  userDisliked: { type: Array, default: [] },
});

sauceSchema.methods.likeOrDislike = function(like, user) {
  const userLike = !this.liked (user) && like === 1
  const userDislike = !this.disliked (user) && like === -1
  const userCancelVote  = like === 0

// Like or dislike the sauce 
  if (userLike) this.receiveLike(user)
  else if (userDislike) this.receiveDislike(user)
  else if (userCancelVote) this.resetLikes(user)
}
// Add the user ID to the array
sauceSchema.methods.Liked = function(id) {
  return this.userLiked.find (userId => userId.equals(id));
}
// Remove the user ID from the array
sauceSchema.methods.Disliked = function(id) {
  return this.userDisliked.find (userId => userId.equals(id));
}
// Total number of like to be updated with each like 
sauceSchema.methods.receiveLike = function(user) {
  this.likes += 1;
  this.userLiked.push(user)
}
// Total number of dislike to be updated with each dislike
sauceSchema.methods.receiveDislike = function(user) {
  this.dislikes += 1;
  this.userDisliked.push(user)
}
// Reset the user like or dislike 
sauceSchema.methods.resetLikes = function(user) {
  if (this.liked (user)) {
    this.removeLike(user)
  } else if (this.disliked (user)) {
    this.removeDislike(user)
  }
}

sauceSchema.methods.removeLike = function(user) {
  this.likes -= 1
  this.userLiked = this.userLiked.filter(userId => !userId.equals(user))
}

sauceSchema.methods.removeDislike = function(user) {
  this.dislikes -= 1
  this.userDisliked = this.userDisliked.filter(userId => !userId.equals(user))
}

module.exports = mongoose.model('Sauce', sauceSchema);

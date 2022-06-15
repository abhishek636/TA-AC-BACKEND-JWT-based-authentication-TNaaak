var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  likes: { type: String, default: 0 },
  CreatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  Book: { type: mongoose.Types.ObjectId, ref: 'Book' },
});

module.exports = mongoose.model('Comment', commentSchema);
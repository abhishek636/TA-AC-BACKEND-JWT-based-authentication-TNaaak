var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    books: { type: mongoose.Types.ObjectId, ref: 'Book' },
    comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  
  userSchema.methods.verifyPassword = async function (password) {
    try {
      var result = await bcrypt.compare(password, this.password);
      return result;
      console.log(result);
    } catch (error) {
      return result;
    }
  };
  
  //token
  
  userSchema.methods.signToken = async function () {
    console.log(this);
    var payload = { userId: this.id, email: this.email };
    try {
      var token = await jwt.sign(payload, 'thisissecrte');
      return token;
    } catch (error) {
      return error;
    }
  };
  
  userSchema.methods.userJSON = function (token) {
    return {
      name: this.name,
      email: this.email,
      token: token,
    };
  };
  
  module.exports = mongoose.model('User', userSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
  },
  {
    timestamps: true,
  }
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
  } catch (error) {
    return error;
  }
  bcrypt.compare()
};

userSchema.methods.signToken = async function(){
  console.log(this);
  var payload ={userId:this.id, email: this.email};
  try {
    var token = await jwt.sign(payload,"thisisasecret");
    return token;
  } catch (error) {
    return error;
  }
}

userSchema.methods.userJSON = function (token){
  return{
    name: this.name,
    email:this.email,
    token:token
  }
}

var User = mongoose.model('User', userSchema);
module.exports = User;
const { use } = require('bcrypt/promises');
var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'respond with a api request' });
});

// registation router
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// login router
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password required ' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    // generate a token
    var token = await user.signToken( );
    res.json({user : user.userJSON(token)})
  } catch (error) {
    next(error);
  }
});

module.exports = router;
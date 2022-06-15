var express = require('express');
var User = require('../models/User');
var Book = require('../models/Book');

var router = express.Router();

/* GET list of all books. */
router.get('/', function (req, res, next) {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.json({ books });
  });
});

//create a new book
router.post('/', (req, res, next) => {
  let data = req.body;
  Book.create(data, (err, createdBook) => {
    if (err) return next(err);
    res.json({ createdBook });
  });
});

//update a book

router.put('/:id', (req, res, next) => {
  let data = req.body;
  let bookId = req.params.id;

  Book.findByIdAndUpdate(bookId, data, (err, updatedBook) => {
    if (err) return next(err);
    res.json({ updatedBook });
  });
});

//delete a book

router.delete('/:id', (req, res, next) => {
  let bookId = req.params.id;

  Book.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) return next(err);
    res.json({ deletedBook });
  });
});

//get book by id

router.get('/:id', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.json({ book });
  });
});

module.exports = router;
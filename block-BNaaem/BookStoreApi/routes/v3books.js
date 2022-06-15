var express = require('express');
var _ = require('lodash');
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

//get list of all comments of current book

router.get('/:id/comments', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.json({ book });
    });
});

//creating new comment

router.post('/:id/comment/new', (req, res, next) => {
  let bookId = req.params.id;
  let data = req.body;
  data.createdBy = req.user.id;
  Comment.create(data, (err, createdComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { comments: createdComment.id },
      },
      (err, updatedUser) => {
        res.json({ createdComment, updatedUser });
      }
    );
  });
});

//edit a comment

router.get('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.json({ comment });
  });
});

router.post('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  let data = req.body;

  Comment.findByIdAndUpdate(commentId, data, (err, updatedComment) => {
    if (err) return next(err);
    res.json({ updatedComment });
  });
});

//delete a comment
router.get('/:id/comment/delete/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      deletedComment.createdBy,
      {
        $pull: { comments: deletedComment.id },
      },
      (err, updatedUser) => {
        if (err) return next(err);
        res.json({ deletedComment, updatedUser });
      }
    );
  });
});

//list books by category

router.get('/list/by/:category', function (req, res, next) {
  let category = req.params.category;

  Book.find({ category: category }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count books for each category

router.get('/count/by/category', (req, res, next) => {
  //getting array of all categories

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOfCate = books.reduce((acc, cv) => {
      acc.push(cv.categories);
      return acc;
    }, []);

    arrOfCate = _.uniq(_.flattenDeep(arrOfCate));
    let objOfcount = {};

    arrOfCate.forEach((category) => {
      Book.find({ categories: category }, (err, foundBooks) => {
        if (err) return next(err);

        objOfcount[category] = foundBooks.length;
      });
    });

    res.json(objOfcount);
  });
});

//list of books by auther

router.get('/list/author/:id', function (req, res, next) {
  let authorId = req.params.id;

  User.findById(authorId)
    .populate('books')
    .exec((err, user) => {
      if (err) return next(err);

      res.json({ books: user.books });
    });
});

//list of all tags

router.get('/tags/tagslist', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    res.json({ arrOftags });
  });
});

//list of tags in ascending/descending order
router.get('/tags/tagslist/:type', (req, res, next) => {
  let type = req.params.type;

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    if (type === 'asc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }

    if (type === 'desc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }
  });
});

//filter books by tags

router.get('/list/tags/:name', (req, res, next) => {
  let name = req.params.name;

  Book.find({ tags: name }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count of number of books of each  tags

router.get('/tags/tagslist/count', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    let objOfcount = {};

    arrOftags.forEach((tag) => {
      Book.find({ tags: tag }, (err, booksByTags) => {
        if (err) return next(err);

        objOfcount[tag] = booksByTags.length;
      });
    });

    return res.json(objOfcount);
  });
});

module.exports = router;
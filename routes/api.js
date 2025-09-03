/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models/Book");
const Comment = require("../models/Comment");

module.exports = function (app) {
  /*** my version ***/
  // define method to save book locally in this file
  const createAndSaveBook = (bookData, done) => {
    const book = new Book(bookData);

    book.save((err, savedBook) => {
      if (err) return done(err);
      return done(null, savedBook);
    });
  };


  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});

        // For each book, fetch comment count
        const booksWithCounts = await Promise.all(
          books.map(async (book) => {
            const count = await Comment.countDocuments({ book_id: book._id });
            return {
              _id: book._id,
              title: book.title,
              commentcount: count
            };
          })
        );

        res.json(booksWithCounts);
      } catch (err) {
        console.error(err);
        res.json({ error: 'could not fetch books' });
      }
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) {
        console.log('missing required field title');
        return res.send('missing required field title');
      }

      // build bookData object with input, title
      const bookData = {
        title: title
      };

      // create and save book in database
      createAndSaveBook(bookData, (err, saved) => {
        if (err) {
          return res.json({
            error: 'could not save book'
          });
        }

        //response will contain new book object including atleast _id and title
        res.json({
          _id: saved._id,
          title: saved.title
        })
      });

    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;

      // find the book by id
      Book.findById(bookid, (err, book) => {
        if (err || !book) {
          return res.send('no book exists');
        }

        // find comments linked to this book
        Comment.find({ bookId: book._id }, (err, comments) => {
          if (err) {
            return res.json({ error: 'could not fetch comments' });
          }

          res.json({
            _id: book._id,
            title: book.title,
            comments: comments.map(c => c.comment)
          });
        });
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};

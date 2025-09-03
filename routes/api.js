/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models/Book");

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
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
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
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};

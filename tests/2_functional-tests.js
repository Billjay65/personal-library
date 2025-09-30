/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  /*** my version ***/
  // this.timeout(5000);

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');

        // only check properties if array not empty
        if (res.body.length > 0) {
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
        }
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'Learning the alphabet'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.equal(res.body.title, 'Learning the alphabet', 'Book title should match input');
            done();
          });
      });


      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // Use res.text when the server sends a plain string
            assert.equal(
              res.text,
              'missing required field title',
              'Response should be an error string'
            );
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/wrongid')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists',
              'Response should be an error string'
            )
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        // first, create a book
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'Temporary Test Book' })
          .end(function (err, res) {
            const bookId = res.body._id;

            // now GET the book by that id
            chai
              .request(server)
              .get('/api/books/' + bookId)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, bookId, 'Response should be id of book');
                assert.property(res.body, 'title', 'Book should contain a title');
                assert.property(res.body, 'comments', 'Book should contain comments');
                done();
              });
          });
      });


    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        // first, create a book so we have a valid id
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'Book to comment on' })
          .end(function (err, res) {
            const bookId = res.body._id;

            // now post a comment to that book
            chai
              .request(server)
              .post('/api/books/' + bookId)
              .send({ comment: 'Very nice book' })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, bookId, 'Response should contain book id');
                assert.property(res.body, 'comments', 'Book should contain comments property');
                assert.include(res.body.comments, 'Very nice book', 'Comment should be saved');
                done();
              });
          });
      });


      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .post('/api/books/68c4050eac0a22006b46225e')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              'missing required field comment',
              'Response should be an error string'
            );
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post('/api/books/id_not_in_db')
          .send({
            comment: 'Impressive complete book'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              'no book exists',
              'Response should be an error string'
            );
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        // first, create a book to delete
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'Introduction to python'
          })
          .end(function (err, res) {
            const idToDelete = res.body._id;

            // now perform the DELETE request
            chai
              .request(server)
              .delete('/api/books/' + idToDelete)
              .end(function (err, res) {
                assert.equal(
                  res.text,
                  'delete successful',
                  'Response should be a success string'
                )
              })
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/id_not_in_db')
          .end(function (err, res) {
            assert.equal(
              res.text,
              'no book exists',
              'Response should be an error string'
            );
            done();
          });
      });

    });

  });

});

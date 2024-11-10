const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == undefined || password == undefined) {
    res.status(403).json({error: "Missing parameters in body"})
  }

  let newUser = {username: username, password: password}
  if (users.findIndex(user => user.username === username) !== -1) {
    res.status(403).json({error: "username already exists"});
  } else {
    users.push(newUser);
    res.status(200).json({status: "ok"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = parseInt(req.params.isbn)
  if (isNaN(isbn)) {
    return res.status(403).json({error: "Invalid isbn"})
  }

  let book = books[isbn]
  if (book == undefined) {
    return res.status(404).json({error: "Unknown isbn"})
  }

  return res.status(200).json(book)
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author
  var booksByAuthor = {}
  for (const [isbn, book] of Object.entries(books)) {
    if (book.author === author) {
      booksByAuthor[isbn] = book
    }
  }
  res.status(200).json(booksByAuthor)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  var booksByTitle = {}
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title === title) {
      booksByTitle[isbn] = book
    }
  }
  res.status(200).json(booksByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn)
  if (isNaN(isbn)) {
    return res.status(403).json({error: "Invalid isbn"})
  }

  let book = books[isbn]
  if (book == undefined) {
    return res.status(404).json({error: "Unknown isbn"})
  }

  return res.status(200).json(book.reviews)
});

module.exports.general = public_users;

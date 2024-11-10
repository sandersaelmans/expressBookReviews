const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // check if username is valid
}

const authenticatedUser = (username, password)=> {
  return users.find(user => user.username === username && user.password === password) !== -1
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == undefined || password == undefined) {
    res.status(403).json({error: "Missing parameters in body"})
  }
  var accessToken = jwt.sign(
    { 
      username: username
    }, 
    'mySuperSecretSecret',
  );
  req.session.authorization = {
    username, 
    accessToken
  }

  return res.status(200).send({"status": "ok"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn)
  if (isNaN(isbn)) {
    return res.status(403).json({error: "Invalid isbn"})
  }
  let reviewContent = req.query.review
  if (reviewContent == undefined) {
    return res.status(403).json({error: "Missing 'review' query parameter"})
  }

  let username = req.username;
  if (username == undefined) {
    return res.status(403).json({error: "Could not retrieve username from session"})
  }
  books[isbn].reviews[username] = reviewContent;

  res.status(200).json({status: "ok"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn)
  if (isNaN(isbn)) {
    return res.status(403).json({error: "Invalid isbn"})
  }

  let username = req.username;
  if (username == undefined) {
    return res.status(403).json({error: "Could not retrieve username from session"})
  }
  delete books[isbn].reviews[username];

  res.status(200).json({status: "ok"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

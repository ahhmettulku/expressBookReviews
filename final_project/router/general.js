const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (isValid(username)) {
    users.push({ username: username, password: password });
    res.send(`User "${username}" has been added`);
  } else if (username === undefined || password === undefined) {
    res.send(`Please provide a valid username and password.`);
  } else {
    res.send(`User "${username}" is already exists`);
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = parseInt(req.params.isbn);
  res.send(JSON.stringify(books[isbn]), null, 4);
  // res.send("ISBN Function");
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  let books_props = [];

  for (var book in books) {
    books_props.push(books[book]);
  }

  let filtered_books = books_props.filter((book) => book.author === author);
  res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let books_props = [];

  for (var book in books) {
    books_props.push(books[book]);
  }

  let filtered_books = books_props.filter((book) => book.title === title);
  res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let books_props = [];

  for (var book in books) {
    books_props.push(books[book]);
  }

  let filtered_books = books_props.filter((book) => book === isbn);
  res.send(JSON.stringify(books_props[isbn].reviews, null, 4));
});

public_users.get("/users", (req, res) => {
  return res.send(users);
});

public_users.get("/users/:password", (req, res) => {
  const values = users.values;
  return res.send(values);
});

module.exports.general = public_users;

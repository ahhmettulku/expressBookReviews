const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // //write code to check is the username is valid
  let isExist = users.find((user) => user.username === username);
  if (isExist != undefined) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let isExist = users.find(
    (user) => user.username === username && user.password === password
  );
  if (isExist != undefined) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;
  const user = authenticatedUser(username, password);
  if (user) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
    };

    return res.send(`User ${username} logged in successfully`);
  }
  return res.send("Invalid username or password");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.send("İnside Review Function");
  if (req.session.authorization) {
    const isbn = parseInt(req.params.isbn);
    const review = req.query.review;
    //return res.status(403).json({message: isbn});
    let token = req.session.authorization["accessToken"];
    // return res.send("access token is:" + token);

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        const book = books[isbn];
        let reviews = book.reviews;
        const username = req.user.data;

        //modify the review if the user makes another reviewon the same book
        reviews[username] = review;
        return res.send(
          `"${review}"    review is added to the book: "${book.title}"    by ${username}.\n\n\n` +
            JSON.stringify(book, null, 4)
        );
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "There is no authorization" });
  }
});

//Delete a book review by username and id of the book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.session.authorization) {
    const isbn = parseInt(req.params.isbn);
    const review = req.query.review;
    let token = req.session.authorization["accessToken"];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        const book = books[isbn];
        let reviews = book.reviews;
        const username = req.user.data;
        const review = reviews[username];
        delete reviews[username];
        // reviews[username] = review;
        return res.send(
          `Review   "${review}" written by ${username}  is deleted \n\n` +
            JSON.stringify(book, null, 4)
        );
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "There is no authorization" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

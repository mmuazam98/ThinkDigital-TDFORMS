"use strict";

var express = require("express");

var router = express.Router();

var session = require("express-session");

var mysql = require("mysql");

var bcrypt = require("bcrypt");

var uniqid = require("uniqid"); // const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "td-forms",
// });


var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "EiK0AGjAQm",
  password: "6shuEuE0XY",
  database: "EiK0AGjAQm"
});
router.get("/", function (req, res) {
  if (req.name) res.redirect("/view");
  res.render("index", {
    page: "index"
  });
});
router.get("/error", function (req, res) {
  res.render("error");
}); //signup

router.post("/signup", function _callee(req, res) {
  var salt, hashedPassword, _userID, name, email, password;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.genSalt());

        case 3:
          salt = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

        case 6:
          hashedPassword = _context.sent;
          _userID = uniqid();
          name = req.body.name, email = req.body.email, password = hashedPassword;
          con.query("SELECT Email FROM userdetails WHERE Email ='".concat(email, "'"), function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
              var query = "INSERT INTO userdetails (Name, Email, Password, userID, Profile) VALUES ('".concat(name, "','").concat(email, "','").concat(password, "','").concat(_userID, "', 'def.png')");
              con.query(query, function (err, results) {
                if (err) {
                  res.send(err.message);
                  console.log(err.message);
                } else {
                  req.session.name = name;
                  req.session.userID = _userID;
                  res.redirect("/view");
                  res.status(200);
                }
              });
            } else {
              res.status(400).json({
                message: "Already exists."
              });
            }
          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          res.status(500).send();

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); //login

router.post("/login", function _callee3(req, res) {
  var _req$body, email, password, name, storedPassword, getPass;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // let email = req.body.email;
          // let password = req.body.password;
          _req$body = req.body, email = _req$body.email, password = _req$body.password; // console.log(email);

          if (email && password) {
            storedPassword = "";
            getPass = "SELECT Name, Password, userID FROM userdetails WHERE Email = '".concat(email, "'");
            con.query(getPass, function _callee2(err, results) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!err) {
                        _context2.next = 2;
                        break;
                      }

                      throw err;

                    case 2:
                      if (!(results.length != 0)) {
                        _context2.next = 24;
                        break;
                      }

                      storedPassword = results[0].Password;
                      name = results[0].Name;
                      userID = results[0].userID;
                      _context2.prev = 6;
                      _context2.next = 9;
                      return regeneratorRuntime.awrap(bcrypt.compare(password, storedPassword));

                    case 9:
                      if (!_context2.sent) {
                        _context2.next = 16;
                        break;
                      }

                      req.session.name = name;
                      req.session.userID = userID; // console.log(req.session.userID);

                      res.redirect("/view");
                      res.status(200); //("Success");

                      _context2.next = 17;
                      break;

                    case 16:
                      res.status(400); //("Not Allowed");

                    case 17:
                      _context2.next = 22;
                      break;

                    case 19:
                      _context2.prev = 19;
                      _context2.t0 = _context2["catch"](6);
                      res.status(500);

                    case 22:
                      _context2.next = 25;
                      break;

                    case 24:
                      res.status(401); //("not found");

                    case 25:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, null, null, [[6, 19]]);
            });
          }

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //logout

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});
module.exports = router;
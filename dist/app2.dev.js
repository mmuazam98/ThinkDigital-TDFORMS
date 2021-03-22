"use strict";

var express = require("express");

var app = express();

var util = require("util");

var bodyparser = require("body-parser");

var session = require("express-session");

var mysql = require("mysql");

var bcrypt = require("bcrypt");

var uniqid = require("uniqid");

var multer = require("multer");

var shortid = require("shortid");

var _require = require("body-parser"),
    json = _require.json;

var _require2 = require("express"),
    response = _require2.response; // console.log(shortid.generate());
// app.use(function (req, res, next) {
//   res.set(
//     "Cache-Control",
//     "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
//   );
//   next();
// });


app.use(session({
  secret: "ilu>c8cs",
  resave: true,
  saveUninitialized: true
}));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "td-forms"
}); // const con = mysql.createConnection({
//   host: "sql6.freemysqlhosting.net",
//   user: "sql6399421",
//   password: "KEjd5Mwgtv",
//   database: "sql6399421",
// });

var query = util.promisify(con.query).bind(con);
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(express["static"](__dirname + "/public"));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

var userMiddleware = require("./middleware/validate.js");

app.get("/", userMiddleware.validateRegister, function (req, res) {
  if (req.name) res.redirect("/view");
});
app.get("/error", function (req, res) {
  res.render("error");
});
app.get("/view", userMiddleware.validateRegister, function (req, res) {
  var getDetails = "SELECT Profile,userID FROM userdetails WHERE Name = '".concat(req.name, "'"); // let getForms = `SELECT formID, title, Date FROM formdetails WHERE userID = `

  con.query(getDetails, function (err, results) {
    if (err) {
      req.session.destroy(function (err) {
        res.redirect("/error");
      });
    } // console.log(results[0].userID);


    var id = results[0].userID,
        img = results[0].Profile;
    var getForms = "SELECT formID, title, Date, description FROM formdetails WHERE userID = '".concat(id, "' ORDER BY timestamp ASC");
    con.query(getForms, function (err, result) {
      console.log(req.session.userID);
      res.render("view", {
        page: "view",
        name: req.name,
        image: img,
        form: result
      });
      console.log(result);
    });
  });
}); //signup

app.post("/signup", function _callee(req, res) {
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
              var _query = "INSERT INTO userdetails (Name, Email, Password, userID, Profile) VALUES ('".concat(name, "','").concat(email, "','").concat(password, "','").concat(_userID, "', 'def.png')");

              con.query(_query, function (err, results) {
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

app.post("/login", function _callee3(req, res) {
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

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
}); //view responses

app.get("/responses/:id", function (req, res) {
  var formID = req.params.id;
  var getQuestions = "SELECT questionID,title FROM questions WHERE formID='".concat(formID, "'");

  var getQues = function getQues() {
    return regeneratorRuntime.async(function getQues$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(query(getQuestions));

          case 3:
            questions = _context4.sent;

          case 4:
            _context4.prev = 4;
            return _context4.abrupt("return", questions);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0,, 4, 7]]);
  };

  getQues().then(function (value) {
    var qs = JSON.parse(JSON.stringify(value));
    var responses = [];
    qs.forEach(function (val, index) {
      var getValues = "SELECT questionID,selectedVal FROM userresponses WHERE questionID='".concat(val.questionID, "'");
      con.query(getValues, function (err, result) {
        if (err) {
          req.session.destroy(function (err) {
            res.redirect("/error");
          });
        }

        console.log(result);
        responses.push(JSON.parse(JSON.stringify(result)));

        if (index == qs.length - 1) {
          console.log(responses);
          res.render("responses", {
            questions: qs,
            responses: responses,
            page: "responses"
          });
        }
      });
    });
  });
}); //view form

app.get("/view/:id", function (req, res) {
  var formID = req.params.id;
  var valueMcq = [];
  var getName = "SELECT * FROM formdetails WHERE formID='".concat(formID, "'");

  var getDetails = function getDetails() {
    return regeneratorRuntime.async(function getDetails$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(query(getName));

          case 3:
            details = _context5.sent;

          case 4:
            _context5.prev = 4;
            return _context5.abrupt("return", details);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0,, 4, 7]]);
  };

  getDetails().then(function (value) {
    // console.log(value[0].title);
    var getForm = "SELECT title, type, questionID,isRequired FROM questions WHERE formID='".concat(formID, "' ORDER BY questionID ASC");
    con.query(getForm, function (err, results) {
      if (err) {
        req.session.destroy(function (err) {
          res.redirect("/error");
        });
      }

      console.log(results);
      var myob = JSON.parse(JSON.stringify(results)),
          len = myob.length;
      var c = 0;
      var mcqs = myob.filter(function (ques) {
        return ques.type === "mcq";
      });
      console.log(mcqs);

      if (mcqs.length == 0) {
        res.render("form", {
          page: "form",
          form: JSON.parse(JSON.stringify(results)),
          name: value[0].title,
          description: value[0].description,
          formID: value[0].formID // mcq: valueMcq,

        });
        res.end();
      } else {
        myob.forEach(function (val, index) {
          // console.log(val.type);
          if (val.type == "mcq") {
            console.log(val.questionID);
            var getOpt = "Select questionID,val FROM mcq WHERE questionID='".concat(val.questionID, "'");
            con.query(getOpt, function (err, result) {
              if (err) {
                req.session.destroy(function (err) {
                  res.redirect("/error");
                });
              }

              valueMcq.push(JSON.parse(JSON.stringify(result))); // console.log(valueMcq);

              if (index == len - 1) {
                // res.send(value);
                console.log("hi", valueMcq);
                res.render("form", {
                  page: "form",
                  form: JSON.parse(JSON.stringify(results)),
                  mcq: valueMcq,
                  name: value[0].title,
                  description: value[0].description,
                  formID: value[0].formID
                });
                res.end();
              }
            });
          }
        });
      }
    });
  });
}); //create form

app.get("/createForm", function (req, res) {
  if (req.session.userID) {
    var name = req.name;
    res.render("createForm", {
      page: "createForm",
      name: name
    });
  } else res.redirect("/error"); // console.log(req.session.userID);

});
app.post("/submit", function (req, res) {
  var responseID = shortid.generate();
  var formResponses = req.body;
  var formID = formResponses[0].formID,
      responses = formResponses[0].responses;
  responses.forEach(function (element, index, array) {
    var query = "INSERT INTO userresponses (formID,title,selectedVal,responseID,questionID) VALUES ('".concat(formID, "','").concat(element.title, "','").concat(element.value, "','").concat(responseID, "','").concat(element.questionID, "')");
    con.query(query, function (err, results) {
      if (err) {
        req.session.destroy(function (err) {
          res.redirect("/error");
        });
      }

      res.status(200);
      res.end();
    });
  }); // res.status(200);
});
app.get("/done", function (req, res) {
  res.render("done", {
    page: "done"
  });
});
app.post("/create", function (req, res) {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  var currDate = year + "-" + month + "-" + day; // console.log(currDate);

  var userID = req.session.userID;
  console.log(userID);
  var formID = shortid.generate();
  var questions = req.body;
  var formContent = questions[0].questions;
  formContent.forEach(function (element, index, array) {
    element.questionID = index + shortid.generate();
  });
  var mcqs = formContent.filter(function (ques) {
    return ques.type === "mcq";
  });
  var title = questions[0].title,
      description = questions[0].description; // userID = "1mgwq913f9kkc5fozi";
  // console.log(title, description);

  var createForm = "INSERT INTO formdetails (formID, userID, title, description, Date,timestamp) VALUES ('".concat(formID, "', '").concat(userID, "', '").concat(title, "', '").concat(description, "', '").concat(currDate, "','").concat(Date.now(), "')"); // ('${formID}','${userID}','${title}','${description}','2021-03-11')  `;
  // console.log(mcqs, mcqs.length);

  var mcq = [];
  mcqs.forEach(function (item) {
    mcq.push(item.options);
  });
  console.log(mcq);
  con.query(createForm, function (err, results) {
    if (err) {
      req.session.destroy(function (err) {
        res.redirect("/error");
      });
    }

    var createForm = function createForm() {
      return regeneratorRuntime.async(function createForm$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(query("INSERT INTO questions (formID,questionID,title,type,isRequired) VALUES ?", [formContent.map(function (item) {
                return [formID, item.questionID, item.title, item.type, "true"];
              })]));

            case 3:
              details = _context6.sent;

            case 4:
              _context6.prev = 4;
              return _context6.abrupt("return", true);

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0,, 4, 7]]);
    };

    createForm().then(function () {
      if (mcqs.length > 0) {
        mcqs.forEach(function (element, index) {
          var _loop = function _loop(i) {
            var query = "INSERT INTO mcq (questionID,optionID,val) VALUES ('".concat(element.questionID, "','").concat(shortid.generate(), "','").concat(element.options[i], "')");
            con.query(query, function (err, results) {
              console.log("added mcqs");

              if (index == mcqs.length - 1 && i == element.options.length - 1) {
                console.log("added all mcqs");
                res.redirect("/");
              }
            });
          };

          for (var i = 0; i < element.options.length; i++) {
            _loop(i);
          }
        });
      } else res.redirect("/");
    }); // con.query(
    //   "INSERT INTO questions (formID,questionID,title,type,required) VALUES ?",
    //   [
    //     formContent.map((item) => [
    //       formID,
    //       item.questionID,
    //       item.title,
    //       item.type,
    //       "true",
    //     ]),
    //   ],
    //   (error, results) => {
    //     console.log("added questions");
    //     if (mcqs.length == 0) {
    //       res.status(200);
    //       res.redirect("/");
    //     }
    //   }
    // );
  });
});
app.get("/profile", function (req, res) {
  if (req.session.userID) {
    var getDetails = "SELECT * FROM userdetails WHERE userID='".concat(req.session.userID, "'");
    con.query(getDetails, function (err, results) {
      var name = results[0].Name,
          email = results[0].Email,
          profile = results[0].Profile;
      res.render("profile", {
        page: "profile",
        name: name,
        email: email,
        profile: profile
      });
    });
  }
});
var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myImage"); // Check File Type

function checkFileType(file, cb) {
  // Allowed ext
  var filetypes = /jpeg|jpg|png|gif/; // Check ext

  var extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check mime

  var mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

app.post("/update", function (req, res) {
  console.log(req.body);
  upload(req, res, function (err) {
    if (err) {
      throw err;
    } else {
      if (req.body.profile == undefined) {
        res.redirect("/profile");
      } else {
        console.log("hi");
      }
    }
  });
}); //  https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js/52030566#52030566

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running at http://localhost:".concat(PORT));
});
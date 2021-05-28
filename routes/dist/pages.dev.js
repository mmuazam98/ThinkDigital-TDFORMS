"use strict";

var express = require("express");

var router = express.Router();

var util = require("util");

var session = require("express-session");

var mysql = require("mysql");

var shortid = require("shortid");

var userMiddleware = require("../middleware/validate.js"); // const con = mysql.createConnection({
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
var query = util.promisify(con.query).bind(con);

var parse = function parse(x) {
  return JSON.parse(JSON.stringify(x));
};

router.get("/view", userMiddleware, function _callee(req, res) {
  var order, getDetails, _details, id, img, getForms, forms;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          order = req.query.sort ? req.query.sort.toUpperCase() : "ASC";
          getDetails = "SELECT Profile,userID FROM userdetails WHERE Name = '".concat(req.name, "'");
          _context.next = 5;
          return regeneratorRuntime.awrap(query(getDetails));

        case 5:
          _details = _context.sent;
          id = _details[0].userID, img = _details[0].Profile;
          getForms = "SELECT * FROM formdetails WHERE userID = '".concat(id, "' ORDER BY timestamp ").concat(order);
          _context.next = 10;
          return regeneratorRuntime.awrap(query(getForms));

        case 10:
          forms = _context.sent;
          res.render("view", {
            page: "view",
            name: req.name,
            image: img,
            form: forms
          });
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          res.redirect("/error");

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.post("/update", function _callee2(req, res) {
  var _req$body, formID, status;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, formID = _req$body.formID, status = _req$body.status;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(query("UPDATE formdetails SET isActive='".concat(status, "' WHERE formID='").concat(formID, "'")));

        case 4:
          res.status(200).json({
            success: true
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          res.redirect("/error");

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7]]);
}); //view responses

router.get("/responses/:id", userMiddleware, function _callee4(req, res) {
  var formID, details, getQuestions, questions, qs, responses;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          formID = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(query("SELECT * FROM formdetails WHERE formID='".concat(formID, "'")));

        case 3:
          details = _context4.sent;
          console.log(details[0].title);
          console.log(details[0].description);
          getQuestions = "SELECT questionID,title FROM questions WHERE formID='".concat(formID, "'");
          _context4.next = 9;
          return regeneratorRuntime.awrap(query(getQuestions));

        case 9:
          questions = _context4.sent;
          //   console.log(questions);
          qs = parse(questions);
          responses = [];
          qs.forEach(function _callee3(val, index) {
            var getValues, response;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    getValues = "SELECT questionID,selectedVal FROM userresponses WHERE questionID='".concat(val.questionID, "'");
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(query(getValues));

                  case 3:
                    response = _context3.sent;
                    responses.push(parse(response));

                    if (index == qs.length - 1) {
                      res.render("responses", {
                        questions: qs,
                        responses: responses,
                        title: details[0].title,
                        description: details[0].description
                      });
                    }

                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //! view form

router.get("/view/:id", function _callee6(req, res) {
  var formID, Name, Form, formQuestions, mcqs, valueMcq;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          formID = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(query("SELECT * FROM formdetails WHERE formID='".concat(formID, "'")));

        case 4:
          Name = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(query("SELECT title, type, questionID,isRequired FROM questions WHERE formID='".concat(formID, "' ORDER BY questionID ASC")));

        case 7:
          Form = _context6.sent;

          if (Name[0].isActive == "true") {
            formQuestions = parse(Form);
            mcqs = formQuestions.filter(function (ques) {
              return ques.type === "mcq";
            });

            if (mcqs.length == 0) {
              res.render("form", {
                page: "form",
                form: formQuestions,
                name: Name[0].title,
                description: Name[0].description,
                formID: Form[0].formID
              });
            } else {
              valueMcq = [];
              formQuestions.forEach(function _callee5(val, index, arr) {
                var mcqs;
                return regeneratorRuntime.async(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return regeneratorRuntime.awrap(query("SELECT * FROM mcq WHERE questionID = '".concat(val.questionID, "'")));

                      case 2:
                        mcqs = _context5.sent;
                        if (mcqs.length) valueMcq.push(parse(mcqs));

                        if (Object.is(arr.length - 1, index)) {
                          res.render("form", {
                            page: "form",
                            form: formQuestions,
                            name: Name[0].title,
                            description: Name[0].description,
                            formID: Form[0].formID,
                            mcq: valueMcq
                          });
                        }

                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }
                });
              });
            }
          } else {
            res.render("noLonger", {
              name: Name[0].title
            });
          }

          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](1);
          res.redirect("/error");

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //create form

router.get("/createForm", userMiddleware, function (req, res) {
  var name = req.name;
  res.render("createForm", {
    page: "createForm",
    name: name
  });
});
router.get("/error/nolonger", function (req, res) {
  var name = req.name;
  res.render("noLonger");
});
router.post("/submit", function (req, res) {
  var responseID = shortid.generate();
  var formResponses = req.body;
  var formID = formResponses[0].formID,
      responses = formResponses[0].responses;
  responses.forEach(function (element, index, array) {
    var query = "INSERT INTO userresponses (formID,title,selectedVal,responseID,questionID) VALUES ('".concat(formID, "','").concat(element.title, "','").concat(element.value, "','").concat(responseID, "','").concat(element.questionID, "')");
    con.query(query, function (err, results) {
      if (err) {
        res.redirect("/error");
      }

      if (Object.is(array.length - 1, index)) {
        console.log("Submitted");
        res.status(200).redirect("/done");
      }
    });
  });
});
router.get("/done", function (req, res) {
  res.render("done", {
    page: "done"
  });
});
router.post("/create", function (req, res) {
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
      description = questions[0].description;
  var createForm = "INSERT INTO formdetails (formID, userID, title, description, Date,timestamp) VALUES ('".concat(formID, "', '").concat(userID, "', '").concat(title, "', '").concat(description, "', '").concat(currDate, "','").concat(Date.now(), "')");
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
      return regeneratorRuntime.async(function createForm$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(query("INSERT INTO questions (formID,questionID,title,type,isRequired) VALUES ?", [formContent.map(function (item) {
                return [formID, item.questionID, item.title, item.type, "true"];
              })]));

            case 3:
              details = _context7.sent;

            case 4:
              _context7.prev = 4;
              return _context7.abrupt("return", true);

            case 7:
            case "end":
              return _context7.stop();
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
                res.status(200).redirect("/view");
              }
            });
          };

          for (var i = 0; i < element.options.length; i++) {
            _loop(i);
          }
        });
      } else res.status(201).redirect("/view");
    });
  });
});
router.get("/error/filled", function (req, res) {
  res.render("alreadyFilled", {
    page: "alreadyFilled"
  });
});
module.exports = router;
const express = require("express");
const app = express();
const util = require("util");
const bodyparser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const multer = require("multer");
const shortid = require("shortid");
const { json } = require("body-parser");
const { response } = require("express");
// console.log(shortid.generate());

// app.use(function (req, res, next) {
//   res.set(
//     "Cache-Control",
//     "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
//   );
//   next();
// });

app.use(
  session({
    secret: "ilu>c8cs",
    resave: true,
    saveUninitialized: true,
  })
);
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "td-forms",
});
// const con = mysql.createConnection({
//   host: "sql6.freemysqlhosting.net",
//   user: "sql6399421",
//   password: "KEjd5Mwgtv",
//   database: "sql6399421",
// });

const query = util.promisify(con.query).bind(con);

app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const userMiddleware = require("./middleware/validate.js");

app.get("/", userMiddleware.validateRegister, (req, res) => {
  if (req.name) res.redirect("/view");
});
app.get("/error", (req, res) => {
  res.render("error");
});
app.get("/view", userMiddleware.validateRegister, (req, res) => {
  let getDetails = `SELECT Profile,userID FROM userdetails WHERE Name = '${req.name}'`;
  // let getForms = `SELECT formID, title, Date FROM formdetails WHERE userID = `
  con.query(getDetails, (err, results) => {
    if (err) {
      req.session.destroy(function (err) {
        res.redirect("/error");
      });
    }
    // console.log(results[0].userID);
    let id = results[0].userID,
      img = results[0].Profile;

    let getForms = `SELECT formID, title, Date, description FROM formdetails WHERE userID = '${id}' ORDER BY timestamp ASC`;

    con.query(getForms, (err, result) => {
      console.log(req.session.userID);
      res.render("view", {
        page: "view",
        name: req.name,
        image: img,
        form: result,
      });
      console.log(result);
    });
  });
});

//signup

app.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let userID = uniqid();
    let name = req.body.name,
      email = req.body.email,
      password = hashedPassword;

    con.query(
      `SELECT Email FROM userdetails WHERE Email ='${email}'`,
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          let query = `INSERT INTO userdetails (Name, Email, Password, userID, Profile) VALUES ('${name}','${email}','${password}','${userID}', 'def.png')`;
          con.query(query, (err, results) => {
            if (err) {
              res.send(err.message);
              console.log(err.message);
            } else {
              req.session.name = name;
              req.session.userID = userID;
              res.redirect("/view");
              res.status(200);
            }
          });
        } else {
          res.status(400).json({ message: "Already exists." });
        }
      }
    );
  } catch {
    res.status(500).send();
  }
});

//login
app.post("/login", async (req, res) => {
  // let email = req.body.email;
  // let password = req.body.password;
  let { email, password } = req.body;
  // console.log(email);
  let name;
  if (email && password) {
    let storedPassword = "";
    let getPass = `SELECT Name, Password, userID FROM userdetails WHERE Email = '${email}'`;
    con.query(getPass, async (err, results) => {
      if (err) throw err;
      if (results.length != 0) {
        storedPassword = results[0].Password;
        name = results[0].Name;
        userID = results[0].userID;
        try {
          if (await bcrypt.compare(password, storedPassword)) {
            req.session.name = name;
            req.session.userID = userID;
            // console.log(req.session.userID);
            res.redirect("/view");

            res.status(200); //("Success");
          } else {
            res.status(400); //("Not Allowed");
          }
        } catch {
          res.status(500);
        }
      } else {
        res.status(401); //("not found");
      }
    });
  }
});
//logout
app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

//view responses
app.get("/responses/:id", (req, res) => {
  let formID = req.params.id;
  let getQuestions = `SELECT questionID,title FROM questions WHERE formID='${formID}'`;
  let getQues = async function () {
    try {
      questions = await query(getQuestions);
    } finally {
      return questions;
    }
  };
  getQues().then((value) => {
    let qs = JSON.parse(JSON.stringify(value));
    let responses = [];
    qs.forEach((val, index) => {
      let getValues = `SELECT questionID,selectedVal FROM userresponses WHERE questionID='${val.questionID}'`;
      con.query(getValues, (err, result) => {
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
            page: "responses",
          });
        }
      });
    });
  });
});

//view form
app.get("/view/:id", (req, res) => {
  let formID = req.params.id;
  let valueMcq = [];
  let getName = `SELECT * FROM formdetails WHERE formID='${formID}'`;
  let getDetails = async function () {
    try {
      details = await query(getName);
    } finally {
      return details;
    }
  };
  getDetails().then((value) => {
    // console.log(value[0].title);
    let getForm = `SELECT title, type, questionID,isRequired FROM questions WHERE formID='${formID}' ORDER BY questionID ASC`;
    con.query(getForm, (err, results) => {
      if (err) {
        req.session.destroy(function (err) {
          res.redirect("/error");
        });
      }
      console.log(results);
      let myob = JSON.parse(JSON.stringify(results)),
        len = myob.length;
      let c = 0;
      let mcqs = myob.filter((ques) => ques.type === "mcq");
      console.log(mcqs);
      if (mcqs.length == 0) {
        res.render("form", {
          page: "form",
          form: JSON.parse(JSON.stringify(results)),
          name: value[0].title,
          description: value[0].description,
          formID: value[0].formID,
          // mcq: valueMcq,
        });
        res.end();
      } else {
        myob.forEach((val, index) => {
          // console.log(val.type);
          if (val.type == "mcq") {
            console.log(val.questionID);
            let getOpt = `Select questionID,val FROM mcq WHERE questionID='${val.questionID}'`;
            con.query(getOpt, (err, result) => {
              if (err) {
                req.session.destroy(function (err) {
                  res.redirect("/error");
                });
              }
              valueMcq.push(JSON.parse(JSON.stringify(result)));
              // console.log(valueMcq);
              if (index == len - 1) {
                // res.send(value);
                console.log("hi", valueMcq);
                res.render("form", {
                  page: "form",
                  form: JSON.parse(JSON.stringify(results)),
                  mcq: valueMcq,
                  name: value[0].title,
                  description: value[0].description,
                  formID: value[0].formID,
                });
                res.end();
              }
            });
          }
        });
      }
    });
  });
});
//create form
app.get("/createForm", (req, res) => {
  if (req.session.userID) {
    let name = req.name;
    res.render("createForm", { page: "createForm", name: name });
  } else res.redirect("/error");
  // console.log(req.session.userID);
});
app.post("/submit", (req, res) => {
  let responseID = shortid.generate();
  let formResponses = req.body;
  let formID = formResponses[0].formID,
    responses = formResponses[0].responses;
  responses.forEach((element, index, array) => {
    let query = `INSERT INTO userresponses (formID,title,selectedVal,responseID,questionID) VALUES ('${formID}','${element.title}','${element.value}','${responseID}','${element.questionID}')`;
    con.query(query, (err, results) => {
      if (err) {
        req.session.destroy(function (err) {
          res.redirect("/error");
        });
      }
      res.status(200);
      res.end();
    });
  });
  // res.status(200);
});
app.get("/done", (req, res) => {
  res.render("done", { page: "done" });
});
app.post("/create", (req, res) => {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let currDate = year + "-" + month + "-" + day;
  // console.log(currDate);
  let userID = req.session.userID;
  console.log(userID);
  let formID = shortid.generate();

  let questions = req.body;
  let formContent = questions[0].questions;
  formContent.forEach((element, index, array) => {
    element.questionID = index + shortid.generate();
  });
  let mcqs = formContent.filter((ques) => ques.type === "mcq");

  let title = questions[0].title,
    description = questions[0].description;
  // userID = "1mgwq913f9kkc5fozi";
  // console.log(title, description);
  let createForm = `INSERT INTO formdetails (formID, userID, title, description, Date,timestamp) VALUES ('${formID}', '${userID}', '${title}', '${description}', '${currDate}','${Date.now()}')`; // ('${formID}','${userID}','${title}','${description}','2021-03-11')  `;
  // console.log(mcqs, mcqs.length);
  let mcq = [];
  mcqs.forEach((item) => {
    mcq.push(item.options);
  });
  console.log(mcq);
  con.query(createForm, (err, results) => {
    if (err) {
      req.session.destroy(function (err) {
        res.redirect("/error");
      });
    }
    let createForm = async function () {
      try {
        details = await query(
          "INSERT INTO questions (formID,questionID,title,type,isRequired) VALUES ?",
          [
            formContent.map((item) => [
              formID,
              item.questionID,
              item.title,
              item.type,
              "true",
            ]),
          ]
        );
      } finally {
        return true;
      }
    };
    createForm().then(() => {
      if (mcqs.length > 0) {
        mcqs.forEach((element, index) => {
          for (let i = 0; i < element.options.length; i++) {
            let query = `INSERT INTO mcq (questionID,optionID,val) VALUES ('${
              element.questionID
            }','${shortid.generate()}','${element.options[i]}')`;
            con.query(query, (err, results) => {
              console.log("added mcqs");
              if (index == mcqs.length - 1 && i == element.options.length - 1) {
                console.log("added all mcqs");
                res.redirect("/");
              }
            });
          }
        });
      } else res.redirect("/");
    });
    // con.query(
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
app.get("/profile", (req, res) => {
  if (req.session.userID) {
    let getDetails = `SELECT * FROM userdetails WHERE userID='${req.session.userID}'`;
    con.query(getDetails, (err, results) => {
      let name = results[0].Name,
        email = results[0].Email,
        profile = results[0].Profile;
      res.render("profile", {
        page: "profile",
        name: name,
        email: email,
        profile: profile,
      });
    });
  }
});

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
app.post("/update", (req, res) => {
  console.log(req.body);
  upload(req, res, (err) => {
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
});
//  https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js/52030566#52030566
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

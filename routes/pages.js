const express = require("express");
const router = express.Router();
const util = require("util");
const session = require("express-session");
const mysql = require("mysql");
const shortid = require("shortid");

const userMiddleware = require("../middleware/validate.js");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "td-forms",
// });
// const con = mysql.createConnection({
//   host: "remotemysql.com",
//   user: "EiK0AGjAQm",
//   password: "6shuEuE0XY",
//   database: "EiK0AGjAQm",
// });
const con = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6415699",
  password: "bw2N8KGwB2",
  database: "sql6415699",
});

const query = util.promisify(con.query).bind(con);
const parse = (x) => {
  return JSON.parse(JSON.stringify(x));
};
router.get("/view", userMiddleware, async (req, res) => {
  try {
    let order = req.query.sort ? req.query.sort.toUpperCase() : "ASC";
    let getDetails = `SELECT Profile,userID FROM userdetails WHERE Name = '${req.name}'`;
    let details = await query(getDetails);
    let id = details[0].userID,
      img = details[0].Profile;
    let getForms = `SELECT * FROM formdetails WHERE userID = '${id}' ORDER BY timestamp ${order}`;
    let forms = await query(getForms);
    res.render("view", {
      page: "view",
      name: req.name,
      image: img,
      form: forms,
    });
  } catch (err) {
    res.redirect("/error");
  }
});
router.post("/update", async (req, res) => {
  let { formID, status } = req.body;
  try {
    await query(`UPDATE formdetails SET isActive='${status}' WHERE formID='${formID}'`);
    res.status(200).json({ success: true });
  } catch (err) {
    res.redirect("/error");
  }
});
//view responses
router.get("/responses/:id", userMiddleware, async (req, res) => {
  let formID = req.params.id;
  let details = await query(`SELECT * FROM formdetails WHERE formID='${formID}'`);
  console.log(details[0].title);
  console.log(details[0].description);
  let getQuestions = `SELECT questionID,title FROM questions WHERE formID='${formID}'`;

  let questions = await query(getQuestions);
  //   console.log(questions);
  let qs = parse(questions);
  let responses = [];
  qs.forEach(async (val, index) => {
    let getValues = `SELECT questionID,selectedVal FROM userresponses WHERE questionID='${val.questionID}'`;
    let response = await query(getValues);
    responses.push(parse(response));
    if (index == qs.length - 1) {
      res.render("responses", {
        questions: qs,
        responses: responses,
        title: details[0].title,
        description: details[0].description,
      });
    }
  });
});

//! view form
router.get("/view/:id", async (req, res) => {
  let formID = req.params.id;
  try {
    const Name = await query(`SELECT * FROM formdetails WHERE formID='${formID}'`);
    const Form = await query(
      `SELECT title, type, questionID,isRequired FROM questions WHERE formID='${formID}' ORDER BY questionID ASC`
    );
    if (Name[0].isActive == "true") {
      let formQuestions = parse(Form);
      let mcqs = formQuestions.filter((ques) => ques.type === "mcq");
      if (mcqs.length == 0) {
        res.render("form", {
          page: "form",
          form: formQuestions,
          name: Name[0].title,
          description: Name[0].description,
          formID: Form[0].formID,
        });
      } else {
        let valueMcq = [];

        formQuestions.forEach(async (val, index, arr) => {
          const mcqs = await query(
            `SELECT * FROM mcq WHERE questionID = '${val.questionID}'`
          );
          if (mcqs.length) valueMcq.push(parse(mcqs));
          if (Object.is(arr.length - 1, index)) {
            res.render("form", {
              page: "form",
              form: formQuestions,
              name: Name[0].title,
              description: Name[0].description,
              formID: Form[0].formID,
              mcq: valueMcq,
            });
          }
        });
      }
    } else {
      res.render("noLonger", { name: Name[0].title });
    }
  } catch (e) {
    res.redirect("/error");
  }
});

//create form
router.get("/createForm", userMiddleware, (req, res) => {
  let name = req.name;
  res.render("createForm", { page: "createForm", name: name });
});
router.get("/error/nolonger", (req, res) => {
  let name = req.name;
  res.render("noLonger");
});

router.post("/submit", (req, res) => {
  let responseID = shortid.generate();
  let formResponses = req.body;
  let formID = formResponses[0].formID,
    responses = formResponses[0].responses;
  responses.forEach((element, index, array) => {
    let query = `INSERT INTO userresponses (formID,title,selectedVal,responseID,questionID) VALUES ('${formID}','${element.title}','${element.value}','${responseID}','${element.questionID}')`;
    con.query(query, (err, results) => {
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
router.get("/done", (req, res) => {
  res.render("done", { page: "done" });
});
router.post("/create", (req, res) => {
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
  let createForm = `INSERT INTO formdetails (formID, userID, title, description, Date,timestamp) VALUES ('${formID}', '${userID}', '${title}', '${description}', '${currDate}','${Date.now()}')`;
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
                res.status(200).redirect("/view");
              }
            });
          }
        });
      } else res.status(201).redirect("/view");
    });
  });
});
router.get("/error/filled", (req, res) => {
  res.render("alreadyFilled", { page: "alreadyFilled" });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");

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
router.get("/", (req, res) => {
  if (req.name) res.redirect("/view");
  res.render("index", { page: "index" });
});
router.get("/error", (req, res) => {
  res.render("error");
});
//signup

router.post("/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
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
router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});
module.exports = router;

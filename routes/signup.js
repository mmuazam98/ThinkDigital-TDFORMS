const express = require("express");
const bodyparser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const multer = require("multer");
const router = express.Router();
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
              res.redirect("/home");
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
module.exports = router;

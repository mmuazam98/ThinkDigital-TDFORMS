const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    secret: "ilu>c8cs",
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const adminLinks = require("./routes/admin");
const pageRoutes = require("./routes/pages");
app.use("/", adminLinks);
app.use("/", pageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

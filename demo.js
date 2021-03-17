var mysql = require("mysql");
const util = require("util");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "td-forms",
});

const query = util.promisify(con.query).bind(con);

let result = async function () {
  try {
    count = await query(
      "SELECT COUNT(DISTINCT questionID) AS count FROM questions WHERE formID='Mba9DhNa3'"
    );
  } finally {
    con.end();
    return count;
  }
};

result().then((value) => {
  console.log(value);
});

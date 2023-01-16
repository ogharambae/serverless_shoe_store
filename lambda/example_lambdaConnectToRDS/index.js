var mysql = require('mysql');

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123"
});

exports.handler = async (event) => {
  return new Promise((res, rej) => {
    // Query
    con.query("", [], () => {

    });

    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
    };
    res(response);
  })

};

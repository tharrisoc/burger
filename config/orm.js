var connection = require("./connection.js");

// Object Relational Mapper (ORM)

// The ?? signs are for swapping out table or column names
// The ? signs are for swapping out other values
// These help avoid SQL injection
// https://en.wikipedia.org/wiki/SQL_injection
var orm = {
  selectAll: function(tableInput, cb) {
    var queryString = "SELECT * FROM ??";

    connection.query(queryString, [tableInput],
      function(err, result) {
        if (err) {
          console.log(err.message);
          throw err;
        }
        console.log(result);
        cb(result);
      });
  },
  insertOne: function(tableInput, columnList, valueList) {
    var queryString = "INSERT INTO ?? (??) VALUES (??)";

    connection.query(queryString, [tableInput, columnList, valueList],
      function(err, result) {
        if (err) {
          console.log(err.message);
          throw err
        }
        console.log(result);
        console.log(valueList + " inserted successfully");
      });
  },
  updateOne: function(tableInput, changeColumn, newValue, whereColumn, whereValue) {
    // TODO: the query should be able to update more than one column at a time
    var queryString = "UPDATE ?? SET ?? = ?? WHERE ?? = ??";

    connection.query(
      queryString,
      [tableInput, changeColumn, newValue, whereColumn, whereValue],
      function(err, result) {
        if (err) {
          console.log(err.message);
          throw err;
        }
        console.log(result);
        console.log("id " + whereValue + " updated successfully");
      }
    );
  },
  selectAllWhere: function(tableInput, whereColumn, whereValue, cb) {
    var queryString = "SELECT * FROM ?? WHERE ?? = ?";

    connection.query(queryString, [tableInput, whereColumn, whereValue],
      function(err, result) {
        if (err) {
          console.log(err.message);
          throw err
        }
        console.log(result);
        cb(result);
      });
  }
};

module.exports = orm;

'use strict';

var express    = require("express");
var bodyParser = require("body-parser");
var exphbs     = require('express-handlebars');
var mysql      = require('mysql');

var orm        = require("./config/orm.js");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs( {defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

/*
var connection = mysql.createConnection({
  host: "localhost",
  user: "tom", 
  password: "J2MeDev",
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});
*/
// Serve index.handlebars to the root route.
app.get("/", function(req, res) {
  orm.selectAllWhere('burgers', 'devoured', 0, storeUndevouredBurgerList);
  orm.selectAllWhere('burgers', 'devoured', 1, storeDevouredBurgerList);
  createUndevouredButtonNames();
//  res.render("index", {});
});

function storeUndevouredBurgerList(result) {
  console.log("Undevoured");
  console.log(result);

}

function storeDevouredBurgerList(result) {
  console.log("Devoured");
  console.log(result);

}

function createUndevouredButtonNames() {

}

app.listen(PORT);

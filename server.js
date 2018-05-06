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

// The data that is passed to the index template consists of three arrays:
//   1. An array of objects that contain the ID and name of a burger
//      that has been ordered, but not yet consumed
//   2. An array of strings corresponding to the objects in the first
//      array that will be used to supply the name attributes of the
//      "Devour it!" buttons that are associated with those objects.
//   3. An array of objects containing the ID and name of the burgers
//      that have already been consumed.
var data = {
  undevouredList : [],
  buttonList : [],
  devouredList : []
};

// Serve index.handlebars to the root route

app.get("/", function(req, res) {
  // get any uneaten burgers from the database -- they will be listed
  // in the left column of the page, along with "Devour it!" buttons
  orm.selectAllWhere('burgers', 'devoured', 0, storeUndevouredBurgerList);

  // get any consumed burgers from the database -- they will be listed
  // in the right column of the page
  orm.selectAllWhere('burgers', 'devoured', 1, storeDevouredBurgerList);

  console.log(__dirname);  // DEBUG what folder does the script think
                           //       we are in?

  // pass the collected data to the template in preparation for sending
  // the page to the browser
  res.render("index", data);
});

// This function creates a list of the burgers whose devoured field is 0
function storeUndevouredBurgerList(result) {
  console.log("Undevoured");
  console.log(result);
  data.undevouredList = [];
  var numItems = result.length;
  var text = '';
  var btnName = '';

  for ( var i = 0; i < numItems; i++ ) {
    text = "{ udtext : " + result[i].id + '.' + result[i].burger_name + "}";
    data.undevouredList.push(text);
    // Also create the value for the "Devour it!"" button's name attribute
    btnName = 'devoured#' + result[i].id;
    data.buttonList.push(btnName);
  }
}

// This function creates a list of the burgers whose devoured field is 1
function storeDevouredBurgerList(result) {
  console.log("Devoured");
  console.log(result);
  data.devouredList = [];

  var numItems = result.length;
  var text = '';

  for ( var i = 0; i < numItems; i++ ) {
    text = "{ dtext : " + result[i].id + '.' + result[i].burger_name + "}";
    data.devouredList.push(text);
  }
}

app.listen(PORT);

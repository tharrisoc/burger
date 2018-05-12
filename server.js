'use strict';

var path         = require("path");
var express      = require("express");
var bodyParser   = require("body-parser");
var exphbs       = require('express-handlebars');
var mysql        = require('mysql');
var serveStatic  = require('serve-static');

var orm          = require("./config/orm.js");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

app.engine('handlebars', exphbs( {defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

// Route for serving index.handlebars
app.get("/", function(req, res) {
  processRequest('REFRESHPAGE', req, res);
});

// Route for adding a newly-ordered burger to the database
app.post("/api/add", function(req, res) {
  processRequest('ADDONE', req, res);
});

// Route for updating a consumed burger in the database
app.post("/api/update", function(req, res) {
  processRequest('UPDATEONE', req, res);
});

function processRequest(reqType, req, res) {

  var burger_name = '';
  var id = '';
  const TABLE_NAME = "burgers";

console.log('processRequest: ' + reqType);  //DEBUG
  switch (reqType) {
  	case "REFRESHPAGE" :
      orm.nullDBOperation(TABLE_NAME, res, processRefreshPage);
  	  break;

    case "ADDONE" :
      burger_name = req.body.burgername;
      orm.insertOne(TABLE_NAME, ['burger_name', 'devoured'],
      	            [req.body.burgername, 0], res, processRefreshPage);
      break;

    case "UPDATEONE" :
      id = req.body.name.substring(9);
      orm.updateOne(TABLE_NAME, 'devoured', true, 'id',
                    req.body.name.substring(9), res, processRefreshPage);
      break;

    default :
      console.log("Invalid operation type in processRequest()");
      return;
  }
}

// generate the HTML for recreating an updated index page
// The data that is passed to the index template consists of three arrays:
//   1. An array of objects that contain the ID and name of a burger
//      that has been ordered, but not yet consumed
//   2. An array of strings corresponding to the objects in the first
//      array that will be used to supply the name attributes of the
//      "Devour it!" buttons that are associated with those objects.
//   3. An array of objects containing the ID and name of the burgers
//      that have already been consumed.

function processRefreshPage(result, response) {
console.log("Enter processRefreshPage()");  //DEBUG
  var data = {
    undevouredList : [],
    buttonList : [],
    devouredList : []
  };

  // Create lists of uneaten burgers and consumed burgers, as well as
  // a list of names for the "Devour It!" buttons
  var numItems = result.length;
  var text = '';
  var object = null;
  var string = '';
  var btnName = '';

  for ( var i = 0; i < numItems; i++ ) {
  	if ( result[i].devoured === 0 ) {
      // The burger has not been eaten yet (displayed in left column)
      string = result[i].id + '. ' + result[i].burger_name;
      object = {'udtext' : string};
      data.undevouredList.push(object);
      // Also create the value for the "Devour it!"" button's name attribute
      btnName = 'devoured#' + result[i].id;
      data.buttonList.push(btnName);
  	} else {
      // The burger has already been eaten (displayed in right column)
      string = result[i].id + '. ' + result[i].burger_name;
      object = {'dtext' : string};
      data.devouredList.push(object);
  	}
  }

console.log(data);  // DEBUG
  // pass the collected data to the template in preparation for sending
  // the page to the browser
  // [Note: for debugging purposes, supply a third parameter to res.render
  //        in order to have the html passed back to the callback function,
  //        rather than being sent directly to the browser.]
  // response.render("index", data);
  response.render("index", data,
             function(err, html) {
               console.log(html);
               response.send(html);
             });
}

app.listen(PORT, function() {
  console.log("App listening of PORT " + PORT);
});

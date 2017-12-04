var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

app.use(express.static(__dirname + '/Client'));
app.use(express.static(__dirname + '/Views'));

exports.db = mongoose.createConnection('mongodb://localhost:27017/quiz');
exports.autoIncrement = require('mongoose-auto-increment');
exports.autoIncrement.initialize(exports.db);
require("./Models/model.js");
var router = require("./routes");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.json());

app.use('/', router);

app.listen("8888", function() {
  console.log("Server Started on 8888");
})

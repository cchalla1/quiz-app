var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

app.use(express.static(__dirname + '/Client'));
app.use(express.static(__dirname + '/Views'));

exports.db = mongoose.createConnection('mongodb://heroku_fb6t7469:raiup2rtlui9ei2fi6eja7n5uc@ds129966.mlab.com:29966/heroku_fb6t7469');
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

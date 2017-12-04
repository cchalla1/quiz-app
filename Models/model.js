var mongoose = require("mongoose"),
    autoIncrement = require("../server").autoIncrement,
    db = require("../server").db;
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question : String,
  type : String,
  options : Object
});

var AnswerSchema = new Schema({
  question : {type: Number, ref: "Questions"},
  type : String,
  answer : String
})

QuestionSchema.plugin(autoIncrement.plugin, "Questions");
AnswerSchema.plugin(autoIncrement.plugin, "Answers");
db.model("Questions", QuestionSchema);
db.model("Answers", AnswerSchema);

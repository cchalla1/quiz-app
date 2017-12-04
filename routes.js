var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    db = require("./server").db;
    Questions = db.model("Questions"),
    Answers = db.model("Answers");

router.get("/*", function(req, res, next) {
  if(req.url.includes("api")) {
    next();
  } else {
    res.render("index");
  }
});

router.post("/api/login", function(req, res) {
  var response;
  if(req.body.username === "admin" && req.body.password === "admin") {
    response = {msg:"success", user:"admin"};
  } else if(req.body.username === "user" && req.body.password === "user") {
    response = {msg:"success", user:"user"};
  } else {
    response = {msg:"failure"}
  }
  res.send(response);
});

router.post("/api/postQuestion", function(req, res) {
  var question = new Questions();
  question.question = req.body.question;
  question.type = req.body.type;
  question.options = req.body.options;
  question.save(function(err, ques) {
    if(err) {
      console.log(err);
      res.send(err);
    }
    console.log("-------------",ques);
    var answer = new Answers();
    answer.question = question._id;
    answer.type = question.type;
    answer.answer = req.body.answer;
    answer.save(function(err, ans) {
      if(err) {
        res.send(err);
      }
      res.send({msg : "success"});
    })
  })
});

router.get("/api/getQuestions/:limit", function(req, res) {
  var q = Questions.aggregate({ $sample: { size: parseInt(req.params.limit) }});
  q.exec(function(err, questions) {
    if(err) {
      res.send(err);
    }
    res.send(questions);
  })
});

router.post("/api/postAnswers", function(req, res) {
  var questionIds = [];
  var response = {correctAnswers : [], wrongAnswers : []};
  if(req.body.answers) {
    for (var i in req.body.answers) {
      questionIds.push(i);
    }
  }
  if(questionIds.length > 0) {
    Answers.find({question : {$in: questionIds}}).exec(function(err, answers) {
      if(err) {
        res.send(err);
      }
      for(var j=0; j<answers.length; j++) {
        var submittedAnswer = req.body.answers[answers[j].question].answer?req.body.answers[answers[j].question].answer.toLowerCase():"";
        var actualAnswer = answers[j].answer?answers[j].answer.toLowerCase():"";
        if(submittedAnswer === actualAnswer) {
          req.body.answers[answers[j].question].correctAnswer = answers[j].answer;
          response.correctAnswers.push(req.body.answers[answers[j].question]);
        } else {
          req.body.answers[answers[j].question].correctAnswer = answers[j].answer;
          response.wrongAnswers.push(req.body.answers[answers[j].question]);
        }
      }
      var score = (response.correctAnswers.length/parseInt(req.body.noOfQuestions))*100;
      response.score = +score.toFixed(2);
      res.send(response);
    })
  } else {
    response.score = 0;
    res.send(response);
  }
})

router.get("/api/getAllQuestions", function(req, res) {
  Answers.find().populate('question').exec(function(err, answers) {
    res.send(answers);
  })
})

module.exports = router;

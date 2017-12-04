angular.module("service", [])
.service("UserService", function() {
  this.noOfQuestions = 0;
  this.userResponse = {};

  this.setNoOfQuestions = function(number) {
    this.noOfQuestions = number;
  }

  this.getNoOfQuestions = function() {
    return this.noOfQuestions;
  }

  this.setUserResponse = function(response) {
    this.userResponse = response;
  }

  this.getUserResponse = function() {
    return this.userResponse;
  }
})

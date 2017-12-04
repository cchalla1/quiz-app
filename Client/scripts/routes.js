angular.module("quizApp", ["ngRoute", "LoginController", "UserControllers", "AdminControllers"])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/", {
      templateUrl : "templates/login.html",
      controller : "LoginCtrl"
    })
    .when("/admin", {
      templateUrl : "templates/admin.html",
      controller : "AdminCtrl"
    })
    .when("/allQuestions", {
      templateUrl : "templates/questions.html",
      controller : "AdminQuestionsCtrl"
    })
    .when("/user", {
      templateUrl : "templates/user.html",
      controller : "UserHomeCtrl"
    })
    .when("/startTest", {
      templateUrl : "templates/startTest.html",
      controller : "UserTestCtrl"
    })
    .when("/results", {
      templateUrl : "templates/results.html",
      controller : "UserResultsCtrl"
    });
}])

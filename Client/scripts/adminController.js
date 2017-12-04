angular.module("AdminControllers", ["service"])
.controller("AdminCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  var alphabets = ["A", "B", "C", "D", "E", "F","G", "H"];
  $scope.data = {options:{}};
  $scope.msg = "Admin";
  $scope.aphabetsArray = function(num) {
    return alphabets.slice(0, num);
  }

  $scope.doSubmit = function() {
    if($scope.data.type === "text") {
      $scope.data.options = {};
    }
    $http.post("/api/postQuestion", $scope.data).then(function(response) {
      if(response.data.msg === "success") {
        $scope.statusMsg = "Question submitted Successfully";
        $scope.data = {options:{}};
      } else {
        $scope.statusMsg = "Error occured while posting the question";
      }
    })
  }

  $scope.allQuestions = function() {
    $location.path("/allQuestions");
  }
}])

.controller("AdminQuestionsCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {

  var init = function() {
    $http.get("/api/getAllQuestions").then(function(response) {
      $scope.questions = response.data;
    })
  }
  init();

  $scope.goHome = function() {
    $location.path("/admin");
  }
}])

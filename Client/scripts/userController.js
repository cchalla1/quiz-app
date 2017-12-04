angular.module("UserControllers", ["service"])

.controller("UserHomeCtrl", ['$scope', '$location', 'UserService', function($scope, $location, UserService) {
  $scope.noOfQuestions= 0;
  
  $scope.logout = function() {
	$location.path("/");
  }

  $scope.startTest = function() {
    if($scope.noOfQuestions > 0) {
      UserService.setNoOfQuestions($scope.noOfQuestions);
      $location.path("/startTest");
    } else {
      alert("Please specify no.of questions needed");
    }
  }
}])

.controller("UserTestCtrl", ['$scope', '$location', '$http', 'UserService', '$interval', function($scope, $location, $http, UserService, $interval) {
  var allQuestions = [];
  var currentIndex = 0;
  $scope.data = {};
  $scope.currentQuestion = {};
  $scope.userResponse = {};
  var init = function() {
    if(UserService.getNoOfQuestions()>0) {
      $http.get("/api/getQuestions/"+UserService.getNoOfQuestions()).then(function(response) {
        allQuestions = response.data;
        $scope.currentQuestion = allQuestions[0];
        UserService.setNoOfQuestions(allQuestions.length);
        $scope.firstQuestion = true;
        if(allQuestions.length == 1){
          $scope.lastQuestion = true;
        }
        $scope.timer();
      });
    } else {
      $location.path("/user");
    }
  }

  init();

  $scope.nextQuestion = function() {
    recordResults();
    if(currentIndex>=0 && currentIndex<allQuestions.length-1) {
      $scope.currentQuestion = allQuestions[currentIndex+1];
      currentIndex++;
      $scope.firstQuestion = false;
      if(currentIndex==allQuestions.length-1) {
        $scope.lastQuestion = true;
      } else {
        $scope.lastQuestion = false;
      }
    }
  }

  $scope.previousQuestion = function() {
    recordResults();
    if(currentIndex>0) {
      $scope.currentQuestion = allQuestions[currentIndex-1];
      currentIndex--;
      $scope.lastQuestion = false;
      if(currentIndex==0) {
        $scope.firstQuestion = true;
      } else {
        $scope.firstQuestion = false;
      }
    }
  }

  var recordResults = function() {
    $scope.userResponse[$scope.currentQuestion._id] = $scope.currentQuestion;
    $scope.userResponse[$scope.currentQuestion._id].answer = $scope.data.answer;
  }

  $scope.timer = function() {
    $scope.hours = (UserService.getNoOfQuestions() - UserService.getNoOfQuestions()%60)/60;
    $scope.minutes = UserService.getNoOfQuestions()%60;
    $scope.seconds = 0;
    var start = $interval(function () {
      if($scope.hours == 0 && $scope.minutes == 0 && $scope.seconds == 0) {
        $interval.cancel(start);
        $scope.submitResults();
      } else if($scope.hours && $scope.minutes == 0 && $scope.seconds == 0) {
        $scope.hours -= 1;
        $scope.minutes = 59;
        $scope.seconds = 59;
      }else if($scope.seconds == 0) {
        $scope.minutes -= 1;
        $scope.seconds = 59;
      } else {
        $scope.seconds -= 1;
      }

    }, 1000);
  }

  $scope.submitResults = function() {
    recordResults();
    UserService.setUserResponse($scope.userResponse);
    $location.path("/results");
  }

}])

.controller("UserResultsCtrl", ['$scope', '$location', '$http', 'UserService', function($scope, $location, $http, UserService) {
  $scope.noOfQuestions = UserService.getNoOfQuestions();
  if($scope.noOfQuestions<=0) {
    $location.path("/user");
  }
  var init = function() {
    var answers = UserService.getUserResponse();
    $http.post("/api/postAnswers", {answers:answers, noOfQuestions:$scope.noOfQuestions}).then(function(response) {
      $scope.data = response.data;
    })
  }

  init();

  $scope.startTest = function() {
    $location.path("/user");
  }
}])

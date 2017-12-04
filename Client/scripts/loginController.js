angular.module("LoginController", [])
.controller("LoginCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.data = {};
  $scope.errorFlag = false;
  $scope.doLogin = function() {
    $http.post("/api/login", $scope.data).then(function(response) {
      if(response.data.msg === "success") {
        $scope.errorFlag = false;
        if(response.data.user === "admin") {
          $location.path("/admin");
        } else {
          $location.path("/user");
        }
      } else {
        $scope.errorFlag = true;
        $scope.error = "Username/Password entered is wrong";
      }
    })
  }
}])

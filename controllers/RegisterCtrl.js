app.controller("RegisterCtrl", function ($scope, authService, $location) {

    $scope.user = {};

    $scope.register = function () {
        console.log($scope.user);
        authService.register($scope.user)
        .then(function (res) {
            console.log(res.data);
            alert("Account created successfully");
            $location.path("/login")
        })
    };
});
app.controller("LoginCtrl", function ($scope, authService, $location) {

    $scope.user = {};

    $scope.login = function () {
        authService.login($scope.user)
        .then(function (res) {
            localStorage.setItem("token", res.data.access_token);
            if (user.role === "admin") {
                $location.path("/dashboard");
            }
            if (user.role === "user") {
                $location.path("/home");
            }
        })
    };
    $scope.logout = function () {
        authService.logout();
    };
});
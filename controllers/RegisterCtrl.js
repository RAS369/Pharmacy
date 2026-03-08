app.controller("RegisterCtrl", function ($scope, authService, $location) {

    $scope.user = {};

    $scope.register = function () {
        authService.register($scope.user)
            .then(function () {
                alert("Account created successfully");
                $location.path("/login");
            })
            .catch(function (err) {
                var msg = (err.data && err.data.msg) || "Could not create account.";
                alert(msg);
            });
    };
});

app.controller("LoginCtrl", function ($scope, $rootScope, authService, $location) {
    $scope.email = "";
    $scope.password = "";

    $scope.login = function () {
        var credentials = {
            email: $scope.email,
            password: $scope.password
        };

        authService.login(credentials)
            .then(function (res) {
                var token = res.data.access_token;
                var userId = res.data.user && res.data.user.id;
                var userEmail = res.data.user && res.data.user.email;
                var username = res.data.user &&
                    res.data.user.user_metadata &&
                    res.data.user.user_metadata.username;

                authService.fetchRoleByEmail(token, userEmail)
                    .then(function (roleRes) {
                        var role = (roleRes.data[0] && roleRes.data[0].role) || 'user';
                        authService.saveSession(token, userId, role);
                        authService.setUserIdentity(userEmail, username);
                        $rootScope.$broadcast("authChanged");
                        $location.path(role === 'admin' ? '/dashboard' : '/home');
                    })
                    .catch(function () {
                        authService.saveSession(token, userId, 'user');
                        authService.setUserIdentity(userEmail, username);
                        $rootScope.$broadcast("authChanged");
                        $location.path('/home');
                    });
            })
            .catch(function (err) {
                alert((err.data && err.data.msg) || "Invalid email or password.");
            });
    };

    $scope.logout = function () {
        authService.logout();
    };
});


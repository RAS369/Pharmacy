app.controller("UsersController", function ($scope, UsersService) {
    $scope.users = [];
    $scope.loading = false;
    $scope.errorMessage = "";
    $scope.searchQuery = "";
    $scope.editingUser = null;

    $scope.loadUsers = function () {
        $scope.loading = true;
        $scope.errorMessage = "";

        UsersService.getUsers($scope.searchQuery)
            .then(function (response) {
                $scope.users = response.data || [];
            })
            .catch(function () {
                $scope.errorMessage = "Failed to load users. Please try again.";
            })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.startEdit = function (user) {
        $scope.editingUser = angular.copy(user);
    };

    $scope.saveUser = function () {
        if (!$scope.editingUser) return;
        UsersService.updateUser($scope.editingUser.id, $scope.editingUser)
            .then(function () {
                var idx = $scope.users.findIndex(function (u) {
                    return u.id === $scope.editingUser.id;
                });
                if (idx !== -1) {
                    $scope.users[idx] = angular.copy($scope.editingUser);
                }
                $scope.editingUser = null;
            });
    };

    $scope.cancelEdit = function () {
        $scope.editingUser = null;
    };

    $scope.deleteUser = function (userId) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        UsersService.deleteUser(userId).then(function () {
            $scope.users = $scope.users.filter(function (u) {
                return u.id !== userId;
            });
        });
    };

    $scope.onSearch = function () {
        $scope.loadUsers();
    };

    $scope.loadUsers();
});

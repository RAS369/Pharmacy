// ============================================================
// MEDCORE ADMIN - Users Controller
// Handles all logic for the Users management page
// ============================================================

angular.module('medcoreAdmin')

  .controller('UsersController', function ($scope, UsersService) {

    // ---- State ------------------------------------------------
    $scope.users         = [];
    $scope.loading       = false;
    $scope.errorMessage  = '';
    $scope.searchQuery   = '';
    $scope.editingUser   = null;   // holds a copy of the user being edited

    // ---- Load users ------------------------------------------
    $scope.loadUsers = function () {
      $scope.loading      = true;
      $scope.errorMessage = '';

      UsersService.getUsers($scope.searchQuery)
        .then(function (response) {
          $scope.users = response.data;
        })
        .catch(function (error) {
          $scope.errorMessage = 'Failed to load users. Please try again.';
          console.error('Users error:', error);
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    // ---- Open edit form for a user ---------------------------
    $scope.startEdit = function (user) {
      // Clone so edits don't affect the table until saved
      $scope.editingUser = angular.copy(user);
    };

    // ---- Save edited user ------------------------------------
    $scope.saveUser = function () {
      UsersService.updateUser($scope.editingUser.id, $scope.editingUser)
        .then(function () {
          // Reflect changes in the local list
          var idx = $scope.users.findIndex(function (u) {
            return u.id === $scope.editingUser.id;
          });
          if (idx !== -1) {
            $scope.users[idx] = angular.copy($scope.editingUser);
          }
          $scope.editingUser = null;
        })
        .catch(function (error) {
          console.error('Save user error:', error);
        });
    };

    // ---- Cancel edit -----------------------------------------
    $scope.cancelEdit = function () {
      $scope.editingUser = null;
    };

    // ---- Delete user -----------------------------------------
    $scope.deleteUser = function (userId) {
      if (!confirm('Are you sure you want to delete this user?')) return;

      UsersService.deleteUser(userId)
        .then(function () {
          $scope.users = $scope.users.filter(function (u) {
            return u.id !== userId;
          });
        })
        .catch(function (error) {
          console.error('Delete user error:', error);
        });
    };

    // ---- Search (called on input change) ---------------------
    $scope.onSearch = function () {
      $scope.loadUsers();
    };

    // ---- Init ------------------------------------------------
    $scope.loadUsers();

  });

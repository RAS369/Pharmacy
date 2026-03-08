// admin/controllers/nav.controller.js
angular.module('medcoreAdmin')
.controller('NavCtrl', function ($scope, $location) {

    /**
     * Returns true when the current route matches the given path.
     * Used in the sidebar: ng-class="{ active: isActive('/admin/users') }"
     */
    $scope.isActive = function (path) {
        return $location.path() === path;
    };

});

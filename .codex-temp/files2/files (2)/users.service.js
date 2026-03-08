// ============================================================
// MEDCORE ADMIN - Users Service
// All user-related API calls go here
// ============================================================

angular.module('medcoreAdmin')

  .service('UsersService', function ($http, SupabaseConfig) {

    var self = this;

    // ----------------------------------------------------------
    // GET all users
    // ----------------------------------------------------------
    self.getUsers = function (search) {
      var url = SupabaseConfig.tableUrl('users') + '?select=*';

      if (search) {
        url += '&or=(name.ilike.*' + search + '*,email.ilike.*' + search + '*)';
      }

      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // GET a single user by ID
    // ----------------------------------------------------------
    self.getUserById = function (userId) {
      var url = SupabaseConfig.tableUrl('users') + '?id=eq.' + userId + '&select=*';
      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // UPDATE user details
    // ----------------------------------------------------------
    self.updateUser = function (userId, userData) {
      var url = SupabaseConfig.tableUrl('users') + '?id=eq.' + userId;
      return $http.patch(url, userData, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // DELETE a user
    // ----------------------------------------------------------
    self.deleteUser = function (userId) {
      var url = SupabaseConfig.tableUrl('users') + '?id=eq.' + userId;
      return $http.delete(url, { headers: SupabaseConfig.getHeaders() });
    };

  });

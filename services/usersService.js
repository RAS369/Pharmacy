app.service("UsersService", function ($http) {
    this.getUsers = function (search) {
        var url = API_url + "/rest/v1/users?select=*";
        if (search) {
            url += "&or=(name.ilike.*" + search + "*,email.ilike.*" + search + "*)";
        }
        return $http.get(url, { headers: Headers() });
    };

    this.updateUser = function (userId, userData) {
        var url = API_url + "/rest/v1/users?id=eq." + userId;
        return $http.patch(url, userData, { headers: Headers() });
    };

    this.deleteUser = function (userId) {
        var url = API_url + "/rest/v1/users?id=eq." + userId;
        return $http.delete(url, { headers: Headers() });
    };
});

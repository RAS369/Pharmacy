app.service("authService", function ($http, $location) {

    function headers(token) {
        return {
            "apikey": API_KEY,
            "Authorization": "Bearer " + (token || API_KEY),
            "content-type": "application/json",
            "prefer": "return=representation"
        };
    }

    this.register = function (user) {
        return $http.post(API_url + "/auth/v1/signup", {
            email: user.email,
            password: user.password,
            data: { username: user.username || "" }
        }, { headers: headers() });
    };

    this.login = function (user) {
        return $http.post(API_url + "/auth/v1/token?grant_type=password", {
            email: user.email,
            password: user.password
        }, { headers: headers() });
    };

    this.logout = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("cart");
        $location.path("/login");
    };

    this.fetchRoleByEmail = function (token, email) {
        return $http.get(
            API_url + "/rest/v1/users?email=eq." + encodeURIComponent(email || "") + "&select=role&limit=1",
            { headers: headers(token) }
        );
    };

    this.setUserIdentity = function (email, username) {
        localStorage.setItem("userEmail", email || "");
        localStorage.setItem("username", username || "");
    };

    this.saveSession = function (token, userId, role) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role || "user");
    };

    this.isLoggedIn = function () { return localStorage.getItem("token") != null; };
    this.isAdmin = function () { return localStorage.getItem("role") === "admin"; };
    this.getUserId = function () { return localStorage.getItem("userId"); };
    this.getStoredRole = function () { return localStorage.getItem("role"); };
    this.getDisplayName = function () { return localStorage.getItem("username") ||
            localStorage.getItem("userEmail") ||
            "User";
    };
});

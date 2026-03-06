app.service("authService", function ($http, $location) {
    const API_URL = "https://ixaqejrcvebmluptxmuz.supabase.co"
    const config = {
        headers: {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8",
            "content-type": "application/json",
            "prefer": "return=representation"
        }
    }
    this.register = function (user) {
        return $http.post(
            API_URL + "/auth/v1/signup",
            {
                email: user.email,
                password: user.password
            },
            config 
        )
    }

    this.login = function (user) {
        return $http.post(
            API_URL + "/auth/v1/token?grant_type=password",
            {
                email: user.email,
                password: user.password
            },
            config 
        )
    }

    this.logout = function () {
        localStorage.removeItem("token")
        $location.path("/login")
    };

    this.getRole = function (token, userId) {
        return $http.get(
            API_URL + "/rest/v1/users?id=eq." + userId + "&select=role",
            config
        )
    }

    this.saveSession = function (token, userId, role) {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
        localStorage.setItem("role", role)
    }

    this.isLoggedIn = function(){
        return localStorage.getItem("token") != null
    }

    this.isAdmin = function(){
        return localStorage.getItem("role") === "admin"
    }
})



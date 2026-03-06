var app=angular.module('myApp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/home',{
        templateUrl:'views/home.html',
        controller:'HomeCtrl'
    })
    .when("/login", {
    templateUrl: "views/login.html",
    controller: "LoginCtrl"
    })
    .when("/register", {
    templateUrl: "views/register.html",
    controller: "RegisterCtrl"
    })
    .when("/dashboard", {
        templateUrl: "views/AdminDash.html",
        controller: "DashCtrl",
        resolve:{
            auth:function(authService){
                if (!authService.isAdmin()) {
                window.location = "#!/home";
                }
            }
        }
    })
    .when("/alerts", {
        templateUrl: "views/Alerts.html",
        controller: "AlertCtrl"
    })
    .otherwise({
        redirectTo:'/home'
    })
})
var app=angular.module('myApp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/home',{
        templateUrl:'views/home.html',
        controller:'HomeCtrl',
        // data: { role: 'user' }
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
        data: { role: 'admin' }
        // resolve:{
        //     auth:function(authService){
        //         if (!authService.isAdmin()) {
        //         window.location = "#!/home";
        //         }
        //     }
        // }
    })
    .when("/alerts", {
        templateUrl: "views/Alerts.html",
        controller: "AlertCtrl"
    })
    .when("/contactus", {
        templateUrl: "views/contactus.html"
    })
    .when("/aboutus", {
        templateUrl: "views/aboutus.html"
    })
    .when("/shop", {
        templateUrl: "views/categories1.html",
        controller: "ShopController"
    })
    .when("/profile", {
        templateUrl: "views/profile.html",
        controller: "ProfileCtrl"
    })
    .when("/cart", {
        templateUrl: "views/cart.html",
        controller: "CartCtrl"
    })
    .when("/checkout", {
        templateUrl: "views/checkout.html",
        controller: "CheckoutCtrl"
    })
    .when("/confirmation", {
        templateUrl: "views/confirmation.html",
        controller: "ConfirmationCtrl"
    })
    .when("/inventory", {
        templateUrl: "views/inventory.html",
        controller: "InventoryCtrl",
        data: { role: "admin" }
    })
    .when("/sales-invoices", {
        templateUrl: "views/sales-invoices.html",
        controller: "SalesInvoicesController",
        data: { role: "admin" }
    })
    .when("/users", {
        templateUrl: "views/users.html",
        controller: "UsersController",
        data: { role: "admin" }
    })
    .when("/purchase-history", {
        templateUrl: "views/purchase-history.html",
        controller: "PurchaseHistoryController",
        data: { role: "admin" }
    })

    .otherwise({
        redirectTo:'/home'
    })

})

app.run(function($rootScope, $location, $window, authService) {
    var adminRoutes = ['/dashboard', '/alerts', '/inventory', '/sales-invoices', '/users', '/purchase-history'];
    var onStorageChange = null;

    function calculateCartCount() {
        var cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
        } catch (e) {
            cart = [];
        }
        return cart.reduce(function (sum, item) {
            return sum + (item.quantity || item.cartQty || 0);
        }, 0);
    }

    function updateNavState() {
        $rootScope.isLoggedIn = authService.isLoggedIn();
        $rootScope.displayName = authService.getDisplayName();
        $rootScope.cartCount = calculateCartCount();
    }

    $rootScope.logout = function () {
        authService.logout();
        updateNavState();
    };

    $window.updateCartCount = function () {
        $rootScope.$evalAsync(function () {
            $rootScope.cartCount = calculateCartCount();
        });
    };

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.isAdminRoute = adminRoutes.indexOf($location.path()) !== -1;
        updateNavState();
    });

    $rootScope.$on('$routeChangeStart', function(event, next) {
        var role = localStorage.getItem('role');
        if (next.data && next.data.role) {
            if (next.data.role !== role) {
                event.preventDefault();
                $location.path('/login');
            }
        }
    });
    
    onStorageChange = function () {
        $rootScope.$evalAsync(updateNavState);
    };
    $window.addEventListener("storage", onStorageChange);

    
    updateNavState();
});

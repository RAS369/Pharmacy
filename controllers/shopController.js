app.controller("ShopController", function($scope, $http, $timeout) {

    $scope.medicines        = [];
    $scope.cart             = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.cartCount        = $scope.cart.reduce((sum, item) => sum + (item.cartQty || 0), 0);
    $scope.searchText       = "";
    $scope.selectedCategory = "";
    $scope.maxPrice         = "";
    $scope.sortOption       = "";
    $scope.toasts           = [];

    $scope.showToast = function(message, type) {
        var toast = { message: message, type: type || 'info' };
        $scope.toasts.push(toast);
        $timeout(function() {
            var i = $scope.toasts.indexOf(toast);
            if (i > -1) $scope.toasts.splice(i, 1);
        }, 3000);
    };

    $scope.saveCart = function() {
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        if (window.updateCartCount) {
            window.updateCartCount();
        }
    };

    $scope.searchFilter = function(product) {
        if ($scope.searchText) {
            let text = $scope.searchText.toLowerCase();
            if (!(product.brand_name.toLowerCase().includes(text) ||
                  product.generic_name.toLowerCase().includes(text))) {
                return false;
            }
        }
        if ($scope.maxPrice && product.price > $scope.maxPrice) {
            return false;
        }
        return true;
    };

    $scope.loadMedicines = function() {
        $http({
            method: "GET",
            url: API_url + "/rest/v1/medicines",
            headers: {
                apikey: API_KEY,
                Authorization: "Bearer " + API_KEY
            }
        }).then(function(res) {
            $scope.medicines = res.data;
            $scope.cart.forEach(function(cartItem) {
                var match = $scope.medicines.find(function(m) { return m.id === cartItem.id; });
                if (match) {
                    match.cartQty = cartItem.quantity || cartItem.cartQty || 1;
                }
            });
        });
    };

    $scope.addToCart = function(product) {
        if (product.stock_quantity <= 0) {
            $scope.showToast(product.brand_name + " is out of stock!", "error");
            return;
        }
        var existing = $scope.cart.find(function(i) { return i.id === product.id; });
        if (existing) {
            existing.cartQty++;
            existing.quantity = existing.cartQty;
        } else {
            product.cartQty  = 1;
            product.quantity = 1;
            $scope.cart.push(product);
        }
        product.stock_quantity--;
        $scope.cartCount = $scope.cart.reduce((sum, item) => sum + (item.cartQty || 0), 0);
        $scope.saveCart();
        $scope.showToast(product.brand_name + " added to cart!", "success");
    };

    $scope.increaseQty = function(product) {
        if (product.stock_quantity <= 0) {
            $scope.showToast("Maximum stock reached for " + product.brand_name + "!", "error");
            return;
        }
        product.cartQty++;
        product.quantity = product.cartQty;
        product.stock_quantity--;
        var existing = $scope.cart.find(item => item.id === product.id);
        if (existing) {
            existing.cartQty  = product.cartQty;
            existing.quantity = product.cartQty;
        }
        $scope.cartCount = $scope.cart.reduce((sum, item) => sum + (item.cartQty || 0), 0);
        $scope.saveCart();
    };

    $scope.decreaseQty = function(product) {
        product.cartQty--;
        product.quantity = product.cartQty;
        product.stock_quantity++;

        if (product.cartQty <= 0) {
            product.cartQty  = null;
            product.quantity = 0;
            $scope.cart = $scope.cart.filter(function(i) { return i.id !== product.id; });
        } else {
            var existing = $scope.cart.find(function(i) { return i.id === product.id; });
            if (existing) {
                existing.cartQty  = product.cartQty;
                existing.quantity = product.cartQty;
            }
        }
        $scope.cartCount = $scope.cart.reduce((sum, item) => sum + (item.cartQty || 0), 0);
        $scope.saveCart();
    };

    $scope.loadMedicines();
});
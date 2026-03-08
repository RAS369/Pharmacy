app.controller("HomeCtrl", function ($scope, categoryService, medicineService, $rootScope, $http, $location, authService) {
    function getLocalCart() {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch (e) {
            return [];
        }
    }

    function saveLocalCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart || []));
        if (window.updateCartCount) window.updateCartCount();
    }

    function hydrateQuantities(items) {
        var cart = getLocalCart();
        (items || []).forEach(function (medicine) {
            var existing = cart.find(function (x) { return x.id === medicine.id; });
            medicine.quantity = existing ? (existing.quantity || existing.cartQty || 1) : null;
            medicine.cartQty = medicine.quantity || null;
        });
    }

    function syncMedicineViews(sourceMedicine) {
        function applyTo(list) {
            (list || []).forEach(function (m) {
                if (m.id === sourceMedicine.id) {
                    m.quantity = sourceMedicine.quantity;
                    m.cartQty = sourceMedicine.cartQty;
                    m.stock_quantity = sourceMedicine.stock_quantity;
                }
            });
        }
        applyTo($scope.medicines);
        applyTo($scope.trendingMedicines);
    }

    categoryService.getCategories().then(function (response) {
        $scope.categories = response.data;
    });

    medicineService.getMedicines().then(function (response) {
        $scope.medicines = response.data || [];
        hydrateQuantities($scope.medicines);
    });

    medicineService.getTrending().then(function (response) {
        $scope.trendingMedicines = response.data || [];
        hydrateQuantities($scope.trendingMedicines);
    });

    $rootScope.cart = getLocalCart();

    $scope.addToCart = function (medicine) {
        var userId = authService.getUserId();
        if (!userId) { $location.path("/login"); return; }

        var existing = $rootScope.cart.find(function (x) { return x.id === medicine.id; });
        if ((medicine.stock_quantity || 0) <= 0) {
            alert(existing ? "Maximum stock reached!" : "No stock available");
            return;
        }

        if (existing) {
            existing.quantity += 1;
            existing.cartQty = existing.quantity;
            medicine.quantity = existing.quantity;
            medicine.cartQty = existing.quantity;

            $http({
                method: "PATCH",
                url: API_url + "/rest/v1/" + TABLES.cart + "?user_id=eq." + userId + "&medicine_id=eq." + medicine.id,
                headers: Headers(),
                data: { quantity: existing.quantity }
            });
        } else {
            medicine.quantity = 1;
            medicine.cartQty = 1;
            $rootScope.cart.push(angular.copy(medicine));

            $http({
                method: "POST",
                url: API_url + "/rest/v1/" + TABLES.cart,
                headers: Headers(),
                data: {
                    user_id: userId,
                    medicine_id: medicine.id,
                    quantity: 1
                }
            });
        }

        medicine.stock_quantity = (medicine.stock_quantity || 0) - 1;
        syncMedicineViews(medicine);
        saveLocalCart($rootScope.cart);
    };

    $scope.removeFromCart = function (medicine) {
        var userId = authService.getUserId();
        if (!userId) return;

        if (medicine.quantity > 1) {
            medicine.quantity -= 1;
            var current = $rootScope.cart.find(function (x) { return x.id === medicine.id; });
            if (current) {
                current.quantity = medicine.quantity;
                current.cartQty = medicine.quantity;
            }
            medicine.cartQty = medicine.quantity;

            $http({
                method: "PATCH",
                url: API_url + "/rest/v1/" + TABLES.cart + "?user_id=eq." + userId + "&medicine_id=eq." + medicine.id,
                headers: Headers(),
                data: { quantity: medicine.quantity }
            });
        } else {
            medicine.quantity = null;
            medicine.cartQty = null;
            $rootScope.cart = $rootScope.cart.filter(function (x) { return x.id !== medicine.id; });

            $http({
                method: "DELETE",
                url: API_url + "/rest/v1/" + TABLES.cart + "?user_id=eq." + userId + "&medicine_id=eq." + medicine.id,
                headers: Headers()
            });
        }

        medicine.stock_quantity = (medicine.stock_quantity || 0) + 1;
        syncMedicineViews(medicine);
        saveLocalCart($rootScope.cart);
    };
});

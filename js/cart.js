angular.module('myApp')
.controller('CartCtrl', function($scope, $http, $timeout) {

    $scope.cart             = [];
    $scope.loading          = true;
    $scope.discountCode     = '';
    $scope.appliedCode      = '';
    $scope.discount         = 0;
    $scope.applyingDiscount = false;
    $scope.checkingOut      = false;
    $scope.toasts           = [];

    $scope.showToast = function(message, type) {
        var toast = { message: message, type: type || 'info' };
        $scope.toasts.push(toast);
        $timeout(function() {
            var i = $scope.toasts.indexOf(toast);
            if (i > -1) $scope.toasts.splice(i, 1);
        }, 3500);
    };

    $scope.loadCart = function() {
        $scope.loading = true;
        try {
            var savedCart = JSON.parse(localStorage.getItem("cart")) || [];
            savedCart.forEach(function(item) {
                item.quantity = item.quantity || item.cartQty || 1;
                item.cartQty  = item.quantity;
            });
            $scope.cart = savedCart;
        } catch(e) {
            $scope.cart = [];
        }
        $scope.loading = false;
        if (window.updateCartCount) window.updateCartCount();
    };

    $scope.increaseQty = function(item) {
        item.quantity++;
        item.cartQty = item.quantity;
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        if (window.updateCartCount) window.updateCartCount();
    };

    $scope.decreaseQty = function(item) {
        if (item.quantity <= 1) {
            $scope.removeItem(item);
            return;
        }
        item.quantity--;
        item.cartQty = item.quantity;
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        if (window.updateCartCount) window.updateCartCount();
    };

    $scope.removeItem = function(item) {
        var index = $scope.cart.indexOf(item);
        if (index > -1) {
            $scope.cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        if (window.updateCartCount) window.updateCartCount();
        $scope.recalculateDiscount();
        $scope.showToast((item.brand_name || item.name || 'Item') + ' removed from cart.', 'info');
    };

    $scope.getTotalCount = function() {
        var count = 0;
        angular.forEach($scope.cart, function(item) {
            count += item.quantity || item.cartQty || 0;
        });
        return count;
    };

    $scope.getSubtotal = function() {
        var total = 0;
        angular.forEach($scope.cart, function(item) {
            var price = item.price || item.unit_price || 0;
            var qty   = item.quantity || item.cartQty || 1;
            total += price * qty;
        });
        return total;
    };

    $scope.getTotal = function() {
        return Math.max(0, $scope.getSubtotal() - $scope.discount);
    };

    $scope.applyDiscount = function() {
        var code = ($scope.discountCode || '').trim().toUpperCase();
        if (!code) { $scope.showToast('Please enter a discount code.', 'error'); return; }
        $scope.applyingDiscount = true;
        $timeout(function() {
            $scope.applyingDiscount = false;
            var promo = DISCOUNT_CODES[code];
            if (!promo) {
                $scope.showToast('Invalid discount code: ' + code, 'error');
                $scope.discount = 0; $scope.appliedCode = '';
                return;
            }
            $scope.appliedCode = code;
            if (promo.type === 'percent') {
                $scope.discount = ($scope.getSubtotal() * promo.value) / 100;
                $scope.showToast(promo.value + '% discount applied!', 'success');
            } else {
                $scope.discount = promo.value;
                $scope.showToast('$' + promo.value + ' discount applied!', 'success');
            }
        }, 600);
    };

    $scope.recalculateDiscount = function() {
        if (!$scope.appliedCode) return;
        var promo = DISCOUNT_CODES[$scope.appliedCode];
        if (!promo) return;
        $scope.discount = promo.type === 'percent'
            ? ($scope.getSubtotal() * promo.value) / 100
            : promo.value;
    };

    $scope.proceedToCheckout = function() {
        if ($scope.cart.length === 0) return;
        $scope.checkingOut = true;
        try {
            localStorage.setItem('medcore_order', JSON.stringify({
                items:       $scope.cart,
                subtotal:    $scope.getSubtotal(),
                discount:    $scope.discount,
                appliedCode: $scope.appliedCode,
                total:       $scope.getTotal()
            }));
        } catch(e) { console.error('localStorage error:', e); }

        $timeout(function() {
            window.location.href = PAGES.checkout;
        }, 500);
    };

    $scope.loadCart();
});

angular.module('myApp')
.controller('CheckoutCtrl', function($scope, $http, $timeout) {


    $scope.loading      = true;
    $scope.submitted    = false;
    $scope.placingOrder = false;
    $scope.toasts       = [];
    $scope.order        = { items: [], subtotal: 0, discount: 0, appliedCode: '', total: 0 };
    $scope.form = {
        firstName: '', lastName: '', phone: '', email: '',
        address: '', city: '', state: '', zip: '', notes: '',
        payMethod: 'card',
        cardName: '', cardNumber: '', cardExpiry: '', cardCVV: ''
    };

    $scope.showToast = function(message, type) {
        var toast = { message: message, type: type || 'info' };
        $scope.toasts.push(toast);
        $timeout(function() {
            var i = $scope.toasts.indexOf(toast);
            if (i > -1) $scope.toasts.splice(i, 1);
        }, 3500);
    };

    $scope.loadOrder = function() {
        $scope.loading = true;
        $timeout(function() {
            try {
                var saved = localStorage.getItem('medcore_order');
                if (saved) {
                    $scope.order = JSON.parse(saved);
                } else {
                    $scope.showToast('No cart data found. Redirecting...', 'error');
                    $timeout(function() { window.location.href = PAGES.cart; }, 1800);
                }
            } catch(e) {
                $scope.showToast('Could not load order data.', 'error');
            }
            $scope.loading = false;
        }, 300);
    };


    $scope.formatCardNumber = function() {
        var val = ($scope.form.cardNumber || '').replace(/\D/g, '').substring(0, 16);
        $scope.form.cardNumber = val.replace(/(.{4})/g, '$1 ').trim();
    };

   
    $scope.formatExpiry = function() {
        var val = ($scope.form.cardExpiry || '').replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
            $scope.form.cardExpiry = val.substring(0,2) + '/' + val.substring(2);
        }
    };

   
    $scope.getCardBrand = function() {
        var num = ($scope.form.cardNumber || '').replace(/\s/g, '');
        if (!num) return null;
        if (/^4/.test(num))      return 'visa';
        if (/^5[1-5]/.test(num)) return 'mastercard';
        if (/^3[47]/.test(num))  return 'amex';
        return 'generic';
    };

   
    $scope.isValidCard = function() {
        return ($scope.form.cardNumber || '').replace(/\s/g, '').length === 16;
    };


    $scope.isFormValid = function() {
        var f = $scope.form;
        if (!f.firstName || !f.lastName || !f.phone || !f.email ||
            !f.address) return false;
        if (f.payMethod === 'card') {
            if (!f.cardName || !$scope.isValidCard() || !f.cardExpiry || !f.cardCVV) return false;
        }
        return true;
    };

    $scope.placeOrder = function() {
        $scope.submitted = true;

        if (!$scope.isFormValid()) {
            $scope.showToast('Please fill in all required fields.', 'error');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        var userId = localStorage.getItem("userId");
        if (!userId) {
            $scope.showToast('Please log in to place an order.', 'error');
            $scope.submitted = false;
            window.location.href = '#!/login';
            return;
        }

        $scope.placingOrder = true;

        var fullAddress = [
            $scope.form.address || "",
            $scope.form.city || "",
            $scope.form.state || "",
            $scope.form.zip || ""
        ].filter(Boolean).join(", ");

        var orderData = {
            user_id: userId,
            total: $scope.order.total,
            status: "pending",
            payment_method: $scope.form.payMethod,
            address: fullAddress,
            created_at: new Date().toISOString()
        };

        $http({
            method: "POST",
            url: API_url + "/rest/v1/orders",
            headers: Headers(),
            data: orderData
        })
        .then(function() {
            var orderNumber = 'MC-' + Date.now().toString().slice(-6);

            localStorage.setItem('medcore_confirmation', JSON.stringify({
                orderNumber: orderNumber,
                firstName:   $scope.form.firstName,
                lastName:    $scope.form.lastName,
                email:       $scope.form.email,
                phone:       $scope.form.phone,
                address:     $scope.form.address + ', ' + $scope.form.city + ' ' + $scope.form.zip,
                payMethod:   $scope.form.payMethod,
                items:       $scope.order.items,
                subtotal:    $scope.order.subtotal,
                discount:    $scope.order.discount,
                appliedCode: $scope.order.appliedCode,
                total:       $scope.order.total,
                placedAt:    new Date().toLocaleString()
            }));
            localStorage.setItem('medcore_order_meta', JSON.stringify({
                firstName:   $scope.form.firstName,
                lastName:    $scope.form.lastName,
                email:       $scope.form.email,
                phone:       $scope.form.phone,
                notes:       $scope.form.notes || '',
                city:        $scope.form.city || '',
                state:       $scope.form.state || '',
                zip:         $scope.form.zip || '',
                subtotal:    $scope.order.subtotal,
                discount:    $scope.order.discount,
                appliedCode: $scope.order.appliedCode,
                items:       $scope.order.items
            }));

            localStorage.removeItem('medcore_order');
            localStorage.removeItem('cart');
            if (window.updateCartCount) window.updateCartCount();

            window.location.href = PAGES.confirmation;
        })
        .catch(function(error) {
            console.error('Order failed:', error);
            console.error('Error details:', (error && error.data) || error);
            $scope.placingOrder = false;
            var message = (error && error.data && error.data.message) || 'Failed to place order. Please try again.';
            $scope.showToast(message, 'error');
        });
    };

    $scope.loadOrder();
});


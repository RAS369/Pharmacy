angular.module('myApp')
.controller('ConfirmationCtrl', function($scope, $timeout) {


    $scope.loading = true;
    $scope.confirm = {};

    $scope.loadConfirmation = function() {
        $scope.loading = true;
        $timeout(function() {
            try {
                var saved = localStorage.getItem('medcore_confirmation');
                if (saved) {
                    $scope.confirm = JSON.parse(saved);
                } else {
                  
                    window.location.href = PAGES.cart;
                }
            } catch(e) {
                window.location.href = PAGES.cart;
            }
            $scope.loading = false;
        }, 300);
    };

    $scope.getPayMethodLabel = function(method) {
        var labels = {
            'card':   'Credit Card',
            'paypal': 'PayPal',
            'apple':  'Apple Pay',
            'cash':   'Cash on Delivery'
        };
        return labels[method] || method;
    };

    $scope.printOrder = function() {
        window.print();
    };

    $scope.loadConfirmation();
});


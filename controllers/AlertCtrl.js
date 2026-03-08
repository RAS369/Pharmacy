app.controller("AlertCtrl", function($scope, medicineService) {
    $scope.activeTab = "expiring";
    $scope.expiringItems = [];
    $scope.reorderSuggestions = [];

    var EXPIRY_WINDOW_DAYS = 30;
    var DEFAULT_REORDER_QTY = 20;

    function startOfDay(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function getDaysRemaining(expiryDateStr) {
        var expiry = new Date(expiryDateStr);
        if (isNaN(expiry.getTime())) return null;
        var today = startOfDay(new Date());
        return Math.ceil((startOfDay(expiry) - today) / 86400000);
    }

    function buildExpiringItems(medicines) {
        return (medicines || [])
            .map(function(item) {
                var days = getDaysRemaining(item.expiry_date);
                return angular.extend({}, item, {
                    days_remaining: days,
                    is_expired: days !== null && days < 0
                });
            })
            .filter(function(item) {
                return item.days_remaining !== null && item.days_remaining <= EXPIRY_WINDOW_DAYS;
            })
            .sort(function(a, b) {
                return a.days_remaining - b.days_remaining;
            });
    }

    function buildReorderSuggestions(medicines) {
        return (medicines || [])
            .filter(function(item) {
                return (item.stock_quantity || 0) <= 0;
            })
            .map(function(item) {
                return {
                    id: item.id,
                    brand_name: item.brand_name || item.name,
                    generic_name: item.generic_name || "",
                    current_stock: item.stock_quantity || 0,
                    suggested_qty: DEFAULT_REORDER_QTY,
                    reason: "Out of stock",
                    status: "pending"
                };
            });
    }

    $scope.setSuggestionStatus = function(item, status) {
        item.status = status;
    };

    medicineService.getAllMedicines()
        .then(function(res) {
            var medicines = res.data || [];
            $scope.expiringItems = buildExpiringItems(medicines);
            $scope.reorderSuggestions = buildReorderSuggestions(medicines);
        })
        .catch(function() {
            $scope.expiringItems = [];
            $scope.reorderSuggestions = [];
        });
});

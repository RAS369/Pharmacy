app.controller("PurchaseHistoryController", function ($scope, PurchaseHistoryService) {
    $scope.customers = [];
    $scope.selectedCustomer = null;
    $scope.purchases = [];
    $scope.customerSearch = "";
    $scope.loadingCustomers = false;
    $scope.loadingPurchases = false;
    $scope.errorMessage = "";

    $scope.loadCustomers = function () {
        $scope.loadingCustomers = true;
        PurchaseHistoryService.getCustomers($scope.customerSearch)
            .then(function (response) {
                $scope.customers = response.data || [];
            })
            .finally(function () {
                $scope.loadingCustomers = false;
            });
    };

    $scope.selectCustomer = function (customer) {
        $scope.selectedCustomer = customer;
        $scope.purchases = [];
        $scope.errorMessage = "";
        $scope.loadingPurchases = true;

        PurchaseHistoryService.getPurchasesByCustomer(customer.id)
            .then(function (response) {
                $scope.purchases = response.data || [];
            })
            .catch(function () {
                $scope.errorMessage = "Failed to load purchase history.";
            })
            .finally(function () {
                $scope.loadingPurchases = false;
            });
    };

    $scope.onCustomerSearch = function () {
        $scope.loadCustomers();
    };

    $scope.loadCustomers();
});

// ============================================================
// MEDCORE ADMIN - Purchase History Controller
// Handles the customer selector + purchase list logic
// ============================================================

angular.module('medcoreAdmin')

  .controller('PurchaseHistoryController', function ($scope, PurchaseHistoryService) {

    // ---- State ------------------------------------------------
    $scope.customers         = [];
    $scope.selectedCustomer  = null;
    $scope.purchases         = [];
    $scope.customerSearch    = '';
    $scope.loadingCustomers  = false;
    $scope.loadingPurchases  = false;
    $scope.errorMessage      = '';

    // ---- Load customer list ----------------------------------
    $scope.loadCustomers = function () {
      $scope.loadingCustomers = true;

      PurchaseHistoryService.getCustomers($scope.customerSearch)
        .then(function (response) {
          $scope.customers = response.data;
        })
        .catch(function (error) {
          console.error('Load customers error:', error);
        })
        .finally(function () {
          $scope.loadingCustomers = false;
        });
    };

    // ---- Select a customer and load their purchases ----------
    $scope.selectCustomer = function (customer) {
      $scope.selectedCustomer = customer;
      $scope.purchases        = [];
      $scope.errorMessage     = '';
      $scope.loadingPurchases = true;

      PurchaseHistoryService.getPurchasesByCustomer(customer.id)
        .then(function (response) {
          $scope.purchases = response.data;
        })
        .catch(function (error) {
          $scope.errorMessage = 'Failed to load purchase history.';
          console.error('Purchase history error:', error);
        })
        .finally(function () {
          $scope.loadingPurchases = false;
        });
    };

    // ---- Search customers (called on input change) -----------
    $scope.onCustomerSearch = function () {
      $scope.loadCustomers();
    };

    // ---- Init ------------------------------------------------
    $scope.loadCustomers();

  });

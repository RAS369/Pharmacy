app.controller("DashCtrl", function ($scope, medicineService) {
    medicineService.getAllMedicines().then(function (response) {
        var medicines = Array.isArray(response.data) ? response.data : [];
        var today = new Date();
        $scope.lowStockItems = medicines.filter(function (med) {
            return med.stock_quantity < 10;
        });
        $scope.lowStockCount = $scope.lowStockItems.length;
        $scope.expiredItems = medicines.filter(function (med) {
            return new Date(med.expiry_date) < today;
        });
        $scope.expiredCount = $scope.expiredItems.length;
    }).catch(function () {
        $scope.lowStockItems = [];
        $scope.lowStockCount = 0;
        $scope.expiredItems = [];
        $scope.expiredCount = 0;
    });
});

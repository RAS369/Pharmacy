app.controller("DashCtrl", function ($scope, medicineService) {
    medicineService.getAllMedicines().then(function (response) {
        var medicines = response.data;
        var today = new Date();
        $scope.lowStockItems = medicines.filter(function (med) {
            return med.stock_quantity < 10;
        });
        $scope.lowStockCount = $scope.lowStockItems.length;
        $scope.ExpiredItems = medicines.filter(function(med){
            return new Date(med.expiry_date) < today;
        })
        $scope.expiredCount = $scope.expiredItems.length;

    })


})
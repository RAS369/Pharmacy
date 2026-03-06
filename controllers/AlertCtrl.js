app.controller("AlertCtrl", function($scope, alertService, medicineService){

    $scope.activeTab = "expiring";

    alertService.getReorderSuggestions()
    .then(function(res){
    console.log(res.data);
    $scope.reorderSuggestions = res.data;
    });

    medicineService.getAllMedicines()
    .then(function(res){
        let today = new Date();
        $scope.expiringItems = res.data.filter(function(item){
            return Math.ceil((new Date(item.expiry_date) - today) / 86400000) <= 30;
        });
    });

});
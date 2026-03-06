app.controller('HomeCtrl', function($scope,categoryService,medicineService) {
    categoryService.getCategories().then(function(response){
        console.log(response.data);
        $scope.categories = response.data;
    })
    medicineService.getMedicines().then(function(response){
        console.log(response.data);
        $scope.medicines = response.data;
    });
    medicineService.getTrending().then(function(response) {
        $scope.trendingMedicines = response.data;
    });


});
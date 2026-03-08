app.controller("InventoryCtrl", function ($scope, $http) {
    $scope.medicines = [];
    $scope.showModal = false;
    $scope.searchText = "";
    $scope.newDrug = {};

    function asDate(value) {
        if (!value) return null;
        if (value instanceof Date) return value;
        var d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    function toYMD(value) {
        if (!value) return null;
        var d = asDate(value);
        if (!d) return null;
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, "0");
        var day = String(d.getDate()).padStart(2, "0");
        return y + "-" + m + "-" + day;
    }

    function toPayload(drug) {
        return {
            name: drug.name || "",
            brand_name: drug.brand_name || "",
            generic_name: drug.generic_name || "",
            batch_number: drug.batch_number || "",
            dosage: drug.dosage || "",
            category: drug.category || "",
            stock_quantity: Number(drug.stock_quantity || 0),
            price: Number(drug.price || 0),
            expiry_date: toYMD(drug.expiry_date),
            image_url: drug.image_url || ""
        };
    }

    $scope.loadMedicines = function () {
        $http({
            method: "GET",
            url: API_url + "/rest/v1/medicines?select=*&order=id.desc",
            headers: Headers()
        }).then(function (res) {
            $scope.medicines = res.data || [];
        }).catch(function () {
            $scope.medicines = [];
        });
    };

    $scope.addDrug = function () {
        $scope.newDrug = {};
        $scope.showModal = true;
    };

    $scope.closeModal = function () {
        $scope.showModal = false;
    };

    $scope.view = function (m) {
        alert(
            "Brand: " + (m.brand_name || "") +
            "\nGeneric: " + (m.generic_name || "") +
            "\nDosage: " + (m.dosage || "") +
            "\nCategory: " + (m.category || "") +
            "\nStock: " + (m.stock_quantity || 0) +
            "\nPrice: " + (m.price || 0)
        );
    };

    $scope.edit = function (m) {
        $scope.newDrug = angular.copy(m);
        $scope.newDrug.expiry_date = asDate($scope.newDrug.expiry_date);
        $scope.showModal = true;
    };

    $scope.saveDrug = function () {
        var payload = toPayload($scope.newDrug);

        if ($scope.newDrug.id) {
            $http({
                method: "PATCH",
                url: API_url + "/rest/v1/medicines?id=eq." + $scope.newDrug.id,
                headers: Headers(),
                data: payload
            }).then(function () {
                $scope.loadMedicines();
                $scope.closeModal();
            });
        } else {
            $http({
                method: "POST",
                url: API_url + "/rest/v1/medicines",
                headers: Headers(),
                data: payload
            }).then(function () {
                $scope.loadMedicines();
                $scope.closeModal();
            });
        }
    };

    $scope.deleteDrug = function (id) {
        if (!confirm("Delete this medicine?")) return;
        $http({
            method: "DELETE",
            url: API_url + "/rest/v1/medicines?id=eq." + id,
            headers: Headers()
        }).then(function () {
            $scope.loadMedicines();
        });
    };

    $scope.loadMedicines();
});

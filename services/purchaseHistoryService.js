app.service("PurchaseHistoryService", function ($http) {
    this.getCustomers = function (search) {
        var url = API_url + "/rest/v1/users?select=id,name,email&role=eq.user";
        if (search) {
            url += "&or=(name.ilike.*" + search + "*,email.ilike.*" + search + "*)";
        }
        return $http.get(url, { headers: Headers() });
    };

    this.getPurchasesByCustomer = function (customerId) {
        var url = API_url + "/rest/v1/orders?select=*&user_id=eq." + customerId + "&order=created_at.desc";
        return $http.get(url, { headers: Headers() });
    };
});
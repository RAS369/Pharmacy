app.service("SalesInvoicesService", function ($http) {
    this.getInvoices = function () {
        var url = API_url + "/rest/v1/orders?select=*&order=created_at.desc";
        return $http.get(url, { headers: Headers() });
    };

    this.updateInvoiceStatus = function (invoiceId, newStatus) {
        var url = API_url + "/rest/v1/orders?id=eq." + invoiceId;
        return $http.patch(url, { status: newStatus }, { headers: Headers() });
    };

    this.deleteInvoice = function (invoiceId) {
        var url = API_url + "/rest/v1/orders?id=eq." + invoiceId;
        return $http.delete(url, { headers: Headers() });
    };
});

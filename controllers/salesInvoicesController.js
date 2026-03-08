app.controller("SalesInvoicesController", function ($scope, SalesInvoicesService) {
    $scope.invoices = [];
    $scope.allInvoices = [];
    $scope.loading = false;
    $scope.errorMessage = "";
    $scope.filters = {
        search: "",
        startDate: "",
        endDate: "",
        status: "all"
    };

    $scope.stats = {
        total: 0,
        revenue: 0,
        paid: 0,
        pending: 0
    };

    $scope.calculateStats = function () {
        $scope.stats.total = $scope.invoices.length;
        $scope.stats.revenue = 0;
        $scope.stats.paid = 0;
        $scope.stats.pending = 0;

        $scope.invoices.forEach(function (inv) {
            $scope.stats.revenue += (inv.total || 0);
            if (inv.status === "delivered" || inv.status === "paid") $scope.stats.paid++;
            if (inv.status === "pending") $scope.stats.pending++;
        });
    };

    function parseItemsCount(items) {
        try {
            var parsed = typeof items === "string" ? JSON.parse(items) : items;
            if (!Array.isArray(parsed)) return 0;
            return parsed.reduce(function (sum, i) {
                return sum + (i.quantity || 1);
            }, 0);
        } catch (e) {
            return 0;
        }
    }

    function normalizeInvoice(order) {
        var fullName = ((order.first_name || "") + " " + (order.last_name || "")).trim();
        return {
            id: order.id,
            customer_name: fullName || order.email || order.user_id || "Unknown",
            date: order.created_at,
            items_count: parseItemsCount(order.items),
            subtotal: order.subtotal || order.total || 0,
            discount: order.discount || 0,
            total: order.total || 0,
            status: (order.status || "pending").toLowerCase(),
            payment_method: (order.payment_method || order.pay_method || "").toLowerCase()
        };
    }

    function normalizeFilterDate(value, endOfDay) {
        if (!value) return null;
        var d = value instanceof Date ? new Date(value.getTime()) : new Date(value);
        if (isNaN(d.getTime())) return null;
        if (endOfDay) {
            d.setHours(23, 59, 59, 999);
        } else {
            d.setHours(0, 0, 0, 0);
        }
        return d;
    }

    function applyClientFilters() {
        var q = ($scope.filters.search || "").trim().toLowerCase();
        var startDate = normalizeFilterDate($scope.filters.startDate, false);
        var endDate = normalizeFilterDate($scope.filters.endDate, true);
        var status = ($scope.filters.status || "all").toLowerCase();

        $scope.invoices = $scope.allInvoices.filter(function (inv) {
            var matchesSearch = !q ||
                String(inv.id).toLowerCase().indexOf(q) !== -1 ||
                String(inv.customer_name).toLowerCase().indexOf(q) !== -1;

            var invDate = inv.date ? new Date(inv.date) : null;
            var matchesStart = !startDate || (invDate && invDate >= startDate);
            var matchesEnd = !endDate || (invDate && invDate <= endDate);
            var matchesStatus = status === "all" || inv.status === status;

            return matchesSearch && matchesStart && matchesEnd && matchesStatus;
        });

        $scope.calculateStats();
    }

    $scope.loadInvoices = function () {
        $scope.loading = true;
        $scope.errorMessage = "";

        SalesInvoicesService.getInvoices()
            .then(function (response) {
                var orders = response.data || [];
                $scope.allInvoices = orders.map(normalizeInvoice);
                applyClientFilters();
            })
            .catch(function () {
                $scope.errorMessage = "Failed to load invoices. Please try again.";
            })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.updateStatus = function (invoice, newStatus) {
        SalesInvoicesService.updateInvoiceStatus(invoice.id, newStatus).then(function () {
            invoice.status = newStatus;
            $scope.calculateStats();
        });
    };

    $scope.deleteInvoice = function (invoiceId) {
        if (!confirm("Are you sure you want to delete this invoice?")) return;

        SalesInvoicesService.deleteInvoice(invoiceId).then(function () {
            $scope.allInvoices = $scope.allInvoices.filter(function (inv) {
                return inv.id !== invoiceId;
            });
            applyClientFilters();
        });
    };

    $scope.applyFilters = function () {
        applyClientFilters();
    };

    $scope.resetFilters = function () {
        $scope.filters = { search: "", startDate: "", endDate: "", status: "all" };
        applyClientFilters();
    };

    $scope.loadInvoices();
});

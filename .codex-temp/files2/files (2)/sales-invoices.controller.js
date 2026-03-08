// ============================================================
// MEDCORE ADMIN - Sales Invoices Controller
// Handles all logic for the Sales Invoices page
// ============================================================

angular.module('medcoreAdmin')

  .controller('SalesInvoicesController', function ($scope, SalesInvoicesService) {

    // ---- State ------------------------------------------------
    $scope.invoices      = [];
    $scope.loading       = false;
    $scope.errorMessage  = '';

    $scope.filters = {
      search    : '',
      startDate : '',
      endDate   : '',
      status    : 'all'
    };

    $scope.stats = {
      total   : 0,
      revenue : 0,
      paid    : 0,
      pending : 0
    };

    // ---- Load invoices ----------------------------------------
    $scope.loadInvoices = function () {
      $scope.loading      = true;
      $scope.errorMessage = '';

      SalesInvoicesService.getInvoices($scope.filters)
        .then(function (response) {
          $scope.invoices = response.data;
          $scope.calculateStats();
        })
        .catch(function (error) {
          $scope.errorMessage = 'Failed to load invoices. Please try again.';
          console.error('Invoices error:', error);
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    // ---- Calculate summary stats from loaded invoices ---------
    $scope.calculateStats = function () {
      $scope.stats.total   = $scope.invoices.length;
      $scope.stats.revenue = 0;
      $scope.stats.paid    = 0;
      $scope.stats.pending = 0;

      $scope.invoices.forEach(function (inv) {
        $scope.stats.revenue += (inv.total || 0);
        if (inv.status === 'paid')                              { $scope.stats.paid++;    }
        if (inv.status === 'pending' || inv.status === 'refunded') { $scope.stats.pending++; }
      });
    };

    // ---- Update invoice status --------------------------------
    $scope.updateStatus = function (invoice, newStatus) {
      SalesInvoicesService.updateInvoiceStatus(invoice.id, newStatus)
        .then(function () {
          invoice.status = newStatus;
          $scope.calculateStats();
        })
        .catch(function (error) {
          console.error('Update status error:', error);
        });
    };

    // ---- Delete invoice ---------------------------------------
    $scope.deleteInvoice = function (invoiceId) {
      if (!confirm('Are you sure you want to delete this invoice?')) return;

      SalesInvoicesService.deleteInvoice(invoiceId)
        .then(function () {
          $scope.invoices = $scope.invoices.filter(function (inv) {
            return inv.id !== invoiceId;
          });
          $scope.calculateStats();
        })
        .catch(function (error) {
          console.error('Delete invoice error:', error);
        });
    };

    // ---- Reset filters ----------------------------------------
    $scope.resetFilters = function () {
      $scope.filters = { search: '', startDate: '', endDate: '', status: 'all' };
      $scope.loadInvoices();
    };

    // ---- Init -------------------------------------------------
    $scope.loadInvoices();

  });

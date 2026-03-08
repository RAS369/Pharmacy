// ============================================================
// MEDCORE ADMIN - Main Module
// Registers all admin routes and dependencies
// ============================================================

angular.module('medcoreAdmin', ['ngRoute'])

  .config(function ($routeProvider) {

    $routeProvider

      .when('/admin/sales-invoices', {
        templateUrl: 'admin/views/sales-invoices.html',
        controller: 'SalesInvoicesController'
      })

      .when('/admin/users', {
        templateUrl: 'admin/views/users.html',
        controller: 'UsersController'
      })

      .when('/admin/purchase-history', {
        templateUrl: 'admin/views/purchase-history.html',
        controller: 'PurchaseHistoryController'
      })

      .otherwise({
        redirectTo: '/admin/sales-invoices'
      });

  });

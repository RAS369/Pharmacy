// ============================================================
// MEDCORE ADMIN - Purchase History Service
// All purchase history API calls go here
// ============================================================

angular.module('medcoreAdmin')

  .service('PurchaseHistoryService', function ($http, SupabaseConfig) {

    var self = this;

    // ----------------------------------------------------------
    // GET all customers (for the left panel selector)
    // ----------------------------------------------------------
    self.getCustomers = function (search) {
      var url = SupabaseConfig.tableUrl('users') + '?select=id,name,email';

      if (search) {
        url += '&or=(name.ilike.*' + search + '*,email.ilike.*' + search + '*)';
      }

      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // GET purchase history for a specific customer
    // ----------------------------------------------------------
    self.getPurchasesByCustomer = function (customerId) {
      var url = SupabaseConfig.tableUrl('invoices')
        + '?select=*&user_id=eq.' + customerId
        + '&order=date.desc';

      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

  });

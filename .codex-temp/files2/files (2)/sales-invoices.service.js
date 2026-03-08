// ============================================================
// MEDCORE ADMIN - Sales Invoices Service
// All invoice-related API calls go here
// ============================================================

angular.module('medcoreAdmin')

  .service('SalesInvoicesService', function ($http, SupabaseConfig) {

    var self = this;

    // ----------------------------------------------------------
    // GET all invoices (with optional filters)
    // Params: { search, startDate, endDate, status }
    // ----------------------------------------------------------
    self.getInvoices = function (filters) {
      var url = SupabaseConfig.tableUrl('invoices') + '?select=*';

      // TODO: Add filter query params based on Supabase PostgREST syntax
      // Example: url += '&status=eq.' + filters.status;
      if (filters && filters.status && filters.status !== 'all') {
        url += '&status=eq.' + filters.status;
      }
      if (filters && filters.startDate) {
        url += '&date=gte.' + filters.startDate;
      }
      if (filters && filters.endDate) {
        url += '&date=lte.' + filters.endDate;
      }
      if (filters && filters.search) {
        url += '&or=(id.ilike.*' + filters.search + '*,customer_name.ilike.*' + filters.search + '*)';
      }

      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // GET a single invoice by ID
    // ----------------------------------------------------------
    self.getInvoiceById = function (invoiceId) {
      var url = SupabaseConfig.tableUrl('invoices') + '?id=eq.' + invoiceId + '&select=*';
      return $http.get(url, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // UPDATE invoice status (e.g. mark as paid / refunded)
    // ----------------------------------------------------------
    self.updateInvoiceStatus = function (invoiceId, newStatus) {
      var url = SupabaseConfig.tableUrl('invoices') + '?id=eq.' + invoiceId;
      return $http.patch(url, { status: newStatus }, { headers: SupabaseConfig.getHeaders() });
    };

    // ----------------------------------------------------------
    // DELETE an invoice
    // ----------------------------------------------------------
    self.deleteInvoice = function (invoiceId) {
      var url = SupabaseConfig.tableUrl('invoices') + '?id=eq.' + invoiceId;
      return $http.delete(url, { headers: SupabaseConfig.getHeaders() });
    };

  });


angular.module('medcoreAdmin')

  .service('SupabaseConfig', function () {

    // TODO: Replace with your actual Supabase project credentials
    var API_URL = 'https://ixaqejrcvebmluptxmuz.supabase.co';
    var API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8';

    // Base headers for all Supabase API calls
    this.getHeaders = function () {
      return {
        'apikey': API_KEY,
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8',
        'Content-Type': 'application/json'
      };
    };

    // Build a full REST URL for a given table
    this.tableUrl = function (tableName) {
      return API_URL + '/rest/v1/' + tableName;
    };

    // Expose base URL in case it's needed
    this.baseUrl = API_URL;

  });

app.service("categoryService", function($http){
    const API_URL = "https://ixaqejrcvebmluptxmuz.supabase.co/rest/v1/categories"
    const config = {
        headers: {
            "apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8",
            "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8",
            "content-type":"application/json",
            "prefer":"return=representation"
        }
    }
    this.getCategories = function(){
        return $http.get(API_URL, config);
    };
});
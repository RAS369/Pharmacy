
var API_url = 'https://ixaqejrcvebmluptxmuz.supabase.co';
var API_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YXFlanJjdmVibWx1cHR4bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTQyODgsImV4cCI6MjA4ODE5MDI4OH0.3JBoEqSbS4NDrAG9xxQxspUfg4vpesnKmmw2QIeEUT8';


function Headers() {
    return {
        'Content-Type':  'application/json',
        'apikey':        API_KEY,
        'Authorization': 'Bearer ' + API_KEY,
        'Prefer':        'return=representation'
    };
}


var TABLES = {
    cart:      'cart',        
    orders:    'orders',      
    users:     'users',     
    addresses: 'addresses'    
};


var DISCOUNT_CODES = {
    'VIP10':  { type: 'percent', value: 10 },
    'SAVE20': { type: 'percent', value: 20 },
    'FLAT5':  { type: 'flat',    value: 5  }
};

var PAGES = {
    cart:         '#!/cart',
    checkout:     '#!/checkout',
    confirmation: '#!/confirmation',
    profile:      '#!/profile'
};

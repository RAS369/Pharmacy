
angular.module('myApp')


.filter('capitalize', function() {
    return function(input) {
        if (!input) return '';
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
})

.controller('ProfileCtrl', function($scope, $http, $timeout, authService) {

    $scope.loading          = true;
    $scope.loadingOrders    = false;
    $scope.activeTab        = 'info';
    $scope.editingInfo      = false;
    $scope.infoSubmitted    = false;
    $scope.savingInfo       = false;
    $scope.addrSubmitted    = false;
    $scope.savingAddress    = false;
    $scope.pwSubmitted      = false;
    $scope.changingPassword = false;
    $scope.orderFilter      = 'all';
    $scope.selectedOrder    = null;
    $scope.toasts           = [];
    $scope.orders           = [];
    $scope.addresses        = [];
    $scope.user             = {};
    $scope.editForm         = {};
    $scope.newAddress       = { label: '', full_address: '', city: '', state: '', zip: '', is_default: false };
    $scope.passwordForm     = { current: '', newPw: '', confirm: '' };
    var currentUserId       = authService.getUserId();
    var currentUserEmail    = localStorage.getItem('userEmail') || '';
    var sessionName         = localStorage.getItem('username') || '';

    function buildSessionUserFallback() {
        var nameParts = (sessionName || '').trim().split(/\s+/).filter(Boolean);
        return {
            id: currentUserId || null,
            first_name: nameParts[0] || 'User',
            last_name: nameParts.slice(1).join(' ') || '',
            email: currentUserEmail || '',
            phone: '',
            dob: '',
            gender: '',
            is_vip: false,
            member_since: new Date().getFullYear().toString()
        };
    }


    $scope.showToast = function(message, type) {
        var toast = { message: message, type: type || 'info' };
        $scope.toasts.push(toast);
        $timeout(function() {
            var i = $scope.toasts.indexOf(toast);
            if (i > -1) $scope.toasts.splice(i, 1);
        }, 3500);
    };

    $scope.setTab = function(tab) {
        $scope.activeTab = tab;
      
        if (tab === 'orders' && $scope.orders.length === 0) {
            $scope.loadOrders();
        }
   
        if (tab === 'address' && $scope.addresses.length === 0) {
            $scope.loadAddresses();
        }
    };

   
    $scope.loadUser = function() {
        $scope.loading = true;
        var url = '';
        if (currentUserEmail) {
            url = API_url + '/rest/v1/' + TABLES.users + '?select=*&email=eq.' + encodeURIComponent(currentUserEmail) + '&limit=1';
        } else if (currentUserId) {
            url = API_url + '/rest/v1/' + TABLES.users + '?select=*&id=eq.' + currentUserId + '&limit=1';
        } else {
            $scope.loading = false;
            $scope.showToast('Please log in to view your profile.', 'error');
            return;
        }

        $http({
            method:  'GET',
            url:     url,
            headers: Headers()
        })
        .then(function(response) {
            var row = (response.data && response.data[0]) || null;
            $scope.user = row || buildSessionUserFallback();
            $scope.loading = false;
        })
        .catch(function(error) {
            console.error('Failed to load user:', error);
            $scope.loading = false;
            $scope.showToast('Could not load profile from database. Showing session info.', 'error');
            $scope.user = buildSessionUserFallback();
        });
    };


    $scope.loadOrders = function() {
        if (!currentUserId) {
            $scope.orders = [];
            return;
        }
        $scope.loadingOrders = true;
        $http({
            method:  'GET',
            url:     API_url + '/rest/v1/' + TABLES.orders + '?select=*&user_id=eq.' + currentUserId + '&order=created_at.desc',
            headers: Headers()
        })
        .then(function(response) {
            $scope.orders        = response.data || [];
            $scope.loadingOrders = false;
        })
        .catch(function(error) {
            console.error('Failed to load orders:', error);
            $scope.loadingOrders = false;
            $scope.showToast('Could not load orders. Showing demo data.', 'error');

     
            $scope.orders = [
                {
                    id: 'MC-482910', status: 'delivered', total: 42.23, subtotal: 47.23,
                    discount: 5, created_at: '2025-02-14T10:30:00',
                    first_name: 'Sarah', last_name: 'Johnson', phone: '+1 555 012-3456',
                    address: '123 Main St', city: 'New York', pay_method: 'card',
                    items: '[{"name":"Paracetamol 500mg","category":"Pain Relief","unit_price":4.99,"quantity":2,"emoji":"💊"},{"name":"Vitamin C","category":"Supplements","unit_price":12.50,"quantity":1,"emoji":"🍊"}]'
                },
                {
                    id: 'MC-391827', status: 'pending', total: 27.50, subtotal: 27.50,
                    discount: 0, created_at: '2025-03-01T14:15:00',
                    first_name: 'Sarah', last_name: 'Johnson', phone: '+1 555 012-3456',
                    address: '123 Main St', city: 'New York', pay_method: 'cash',
                    items: '[{"name":"Amoxicillin 250mg","category":"Antibiotics","unit_price":8.75,"quantity":3,"emoji":"💉"}]'
                }
            ];
        });
    };


    $scope.loadAddresses = function() {
        if (!currentUserId) {
            $scope.addresses = [];
            return;
        }
        $http({
            method:  'GET',
            url:     API_url + '/rest/v1/' + TABLES.addresses + '?select=*&user_id=eq.' + currentUserId,
            headers: Headers()
        })
        .then(function(response) {
            $scope.addresses = response.data || [];
        })
        .catch(function(error) {
            console.error('Failed to load addresses:', error);
        });
    };




    $scope.parseItems = function(itemsStr) {
        try { return JSON.parse(itemsStr); } catch(e) { return []; }
    };


    $scope.getFilteredOrders = function() {
        if ($scope.orderFilter === 'all') return $scope.orders;
        return $scope.orders.filter(function(o) { return o.status === $scope.orderFilter; });
    };

    
    $scope.viewOrder      = function(order) { $scope.selectedOrder = order; };
    $scope.closeOrderModal = function()     { $scope.selectedOrder = null;  };


    $scope.cancelOrder = function(order) {
        if (!currentUserId) return;
        if (!confirm('Cancel order #' + order.id + '?')) return;
        $http({
            method:  'PATCH',
            url:     API_url + '/rest/v1/' + TABLES.orders + '?id=eq.' + order.id + '&user_id=eq.' + currentUserId,
            headers: Headers(),
            data:    { status: 'cancelled' }
        })
        .then(function() {
            order.status = 'cancelled';
            $scope.showToast('Order #' + order.id + ' cancelled.', 'info');
        })
        .catch(function() { $scope.showToast('Could not cancel order.', 'error'); });
    };


    $scope.getPayMethodLabel = function(method) {
        var labels = { card: 'Credit Card', paypal: 'PayPal', apple: 'Apple Pay', cash: 'Cash on Delivery' };
        return labels[method] || method;
    };

    $scope.getTotalSpent     = function() { return $scope.orders.reduce(function(s, o) { return s + (o.total || 0); }, 0); };
    $scope.getDeliveredCount = function() { return $scope.orders.filter(function(o) { return o.status === 'delivered'; }).length; };
    $scope.getPendingCount   = function() { return $scope.orders.filter(function(o) { return o.status === 'pending'; }).length; };


    $scope.getInitials = function() {
        var f = ($scope.user.first_name || '').charAt(0).toUpperCase();
        var l = ($scope.user.last_name  || '').charAt(0).toUpperCase();
        return f + l || '?';
    };

 
    $scope.startEditInfo = function() {
        $scope.editForm      = angular.copy($scope.user);
        $scope.editingInfo   = true;
        $scope.infoSubmitted = false;
    };

    $scope.cancelEditInfo = function() {
        $scope.editingInfo   = false;
        $scope.infoSubmitted = false;
    };

    $scope.saveInfo = function() {
        $scope.infoSubmitted = true;
        if (!$scope.editForm.first_name || !$scope.editForm.last_name || !$scope.editForm.email) {
            $scope.showToast('Please fill in all required fields.', 'error');
            return;
        }
        $scope.savingInfo = true;
        $http({
            method:  'PATCH',
            url:     API_url + '/rest/v1/' + TABLES.users + '?id=eq.' + $scope.user.id,
            headers: Headers(),
            data: {
                first_name: $scope.editForm.first_name,
                last_name:  $scope.editForm.last_name,
                email:      $scope.editForm.email,
                phone:      $scope.editForm.phone,
                dob:        $scope.editForm.dob,
                gender:     $scope.editForm.gender
            }
        })
        .then(function() {
            angular.extend($scope.user, $scope.editForm);
            $scope.savingInfo  = false;
            $scope.editingInfo = false;
            $scope.showToast('Profile updated successfully!', 'success');
        })
        .catch(function(error) {
            console.error('Save failed:', error);
            $scope.savingInfo = false;
            $scope.showToast('Could not save changes.', 'error');
        });
    };

  
    $scope.saveAddress = function() {
        $scope.addrSubmitted = true;
        if (!$scope.newAddress.full_address || !$scope.newAddress.city || !$scope.newAddress.zip) {
            $scope.showToast('Please fill in required address fields.', 'error');
            return;
        }
        if (!currentUserId) {
            $scope.showToast('Please log in to save address.', 'error');
            return;
        }
        $scope.savingAddress = true;
        var data = angular.extend({ user_id: currentUserId }, $scope.newAddress);
        $http({
            method:  'POST',
            url:     API_url + '/rest/v1/' + TABLES.addresses,
            headers: Headers(),
            data:    data
        })
        .then(function() {
            $scope.addresses.push(angular.copy(data));
            $scope.newAddress    = { label: '', full_address: '', city: '', state: '', zip: '', is_default: false };
            $scope.addrSubmitted = false;
            $scope.savingAddress = false;
            $scope.showToast('Address saved!', 'success');
        })
        .catch(function(error) {
            console.error('Address save failed:', error);
            $scope.savingAddress = false;
            $scope.showToast('Could not save address.', 'error');
        });
    };


    $scope.setDefaultAddress = function(addr) {
        angular.forEach($scope.addresses, function(a) { a.is_default = false; });
        addr.is_default = true;
        $http({
            method:  'PATCH',
            url:     API_url + '/rest/v1/' + TABLES.addresses + '?id=eq.' + addr.id,
            headers: Headers(),
            data:    { is_default: true }
        })
        .then(function()  { $scope.showToast('Default address updated!', 'success'); })
        .catch(function() { $scope.showToast('Could not update default.', 'error'); });
    };


    $scope.deleteAddress = function(addr) {
        if (!confirm('Delete this address?')) return;
        var index = $scope.addresses.indexOf(addr);
        if (index > -1) $scope.addresses.splice(index, 1);
        $http({
            method:  'DELETE',
            url:     API_url + '/rest/v1/' + TABLES.addresses + '?id=eq.' + addr.id,
            headers: Headers()
        })
        .then(function()  { $scope.showToast('Address deleted.', 'info'); })
        .catch(function() { $scope.showToast('Could not delete address.', 'error'); });
    };

  

    $scope.passwordsMatch = function() {
        return $scope.passwordForm.newPw === $scope.passwordForm.confirm;
    };


    $scope.getPasswordStrength = function() {
        var pw = $scope.passwordForm.newPw || '';
        var score = 0;
        if (pw.length >= 8)          score++;
        if (/[A-Z]/.test(pw))        score++;
        if (/[0-9]/.test(pw))        score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        var levels = [
            { pct: 25,  color: '#e74c3c',          label: 'Weak'     },
            { pct: 50,  color: '#f39c12',          label: 'Fair'     },
            { pct: 75,  color: '#3498db',          label: 'Good'     },
            { pct: 100, color: 'var(--green-500)', label: 'Strong'   }
        ];
        return levels[score - 1] || { pct: 10, color: '#e74c3c', label: 'Too short' };
    };

    $scope.changePassword = function() {
        $scope.pwSubmitted = true;
        if (!$scope.passwordForm.current || !$scope.passwordForm.newPw || !$scope.passwordsMatch()) {
            $scope.showToast('Please check password fields.', 'error');
            return;
        }
        if ($scope.passwordForm.newPw.length < 8) {
            $scope.showToast('Password must be at least 8 characters.', 'error');
            return;
        }
        $scope.changingPassword = true;
        $timeout(function() {
            $scope.changingPassword = false;
            $scope.passwordForm     = { current: '', newPw: '', confirm: '' };
            $scope.pwSubmitted      = false;
            $scope.showToast('Password updated successfully!', 'success');
        }, 1000);
    };

  
    $scope.confirmDeleteAccount = function() {
        if (!confirm('This will permanently delete your account. This cannot be undone.')) return;
        $scope.showToast('Account deletion requested.', 'info');
    };


    $scope.loadUser();
});

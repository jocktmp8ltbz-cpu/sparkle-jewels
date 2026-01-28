// Admin Panel JavaScript - Professional E-commerce System

// Authentication System
let currentAdmin = null;
let isAuthenticated = false;

// Default admin credentials (in real app, this would be in a secure database)
const defaultAdmins = [
    {
        id: 1,
        name: 'Super Admin',
        email: 'admin@sparklejewels.com',
        password: 'admin123', // In real app, this would be hashed
        role: 'super_admin',
        createdAt: new Date().toISOString()
    }
];

// Admin access codes (for signup)
const validAccessCodes = ['SPARKLE2026', 'ADMIN123', 'JEWELS2026'];

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Check if user is already logged in
    const savedAdmin = localStorage.getItem('currentAdmin');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (savedAdmin && rememberMe === 'true') {
        currentAdmin = JSON.parse(savedAdmin);
        isAuthenticated = true;
        showAdminPanel();
    } else {
        showAuthScreen();
    }
    
    // Setup form handlers
    setupAuthForms();
}

function setupAuthForms() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });
    
    // Forgot password form
    document.getElementById('forgot-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
    
    // Password strength checker
    document.getElementById('signup-password').addEventListener('input', function(e) {
        checkPasswordStrength(e.target.value);
    });
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Show loading
    const loginBtn = document.querySelector('#login-form .auth-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<div class="loading"></div> Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        const admin = authenticateAdmin(email, password);
        
        if (admin) {
            currentAdmin = admin;
            isAuthenticated = true;
            
            // Save login state
            localStorage.setItem('currentAdmin', JSON.stringify(admin));
            localStorage.setItem('rememberMe', rememberMe.toString());
            
            // Show success and redirect
            showAuthMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                showAdminPanel();
            }, 1500);
        } else {
            showAuthMessage('Invalid email or password. Please try again.', 'error');
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 1500);
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const adminCode = document.getElementById('admin-code').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (!validAccessCodes.includes(adminCode.toUpperCase())) {
        showAuthMessage('Invalid admin access code!', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAuthMessage('Please agree to the terms and conditions!', 'error');
        return;
    }
    
    // Check if email already exists
    const existingAdmins = JSON.parse(localStorage.getItem('adminUsers')) || defaultAdmins;
    if (existingAdmins.find(admin => admin.email === email)) {
        showAuthMessage('An account with this email already exists!', 'error');
        return;
    }
    
    // Show loading
    const signupBtn = document.querySelector('#signup-form .auth-btn');
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = '<div class="loading"></div> Creating Account...';
    signupBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        const newAdmin = {
            id: Date.now(),
            name: name,
            email: email,
            password: password, // In real app, this would be hashed
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        
        // Save new admin
        existingAdmins.push(newAdmin);
        localStorage.setItem('adminUsers', JSON.stringify(existingAdmins));
        
        showAuthMessage('Account created successfully! Please login.', 'success');
        
        setTimeout(() => {
            showLogin();
            // Pre-fill login form
            document.getElementById('login-email').value = email;
        }, 2000);
        
        signupBtn.innerHTML = originalText;
        signupBtn.disabled = false;
    }, 2000);
}

function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value;
    
    // Show loading
    const forgotBtn = document.querySelector('#forgot-form .auth-btn');
    const originalText = forgotBtn.innerHTML;
    forgotBtn.innerHTML = '<div class="loading"></div> Sending...';
    forgotBtn.disabled = true;
    
    // Simulate sending email
    setTimeout(() => {
        showAuthMessage('Password reset link sent to your email!', 'success');
        
        setTimeout(() => {
            showLogin();
        }, 2000);
        
        forgotBtn.innerHTML = originalText;
        forgotBtn.disabled = false;
    }, 2000);
}

function authenticateAdmin(email, password) {
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || defaultAdmins;
    return adminUsers.find(admin => admin.email === email && admin.password === password);
}

function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById('password-strength');
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthIndicator.className = 'password-strength';
    
    if (strength <= 1) {
        strengthIndicator.classList.add('weak');
    } else if (strength <= 2) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}

function showAuthMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.cssText = `
        padding: 12px 15px;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        text-align: center;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
          type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : 
          'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;'}
    `;
    messageDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Form switching functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'none';
    
    document.getElementById('auth-title').textContent = 'Admin Login';
    document.getElementById('auth-subtitle').textContent = 'Access your admin dashboard';
    
    // Clear any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('forgot-form').style.display = 'none';
    
    document.getElementById('auth-title').textContent = 'Create Admin Account';
    document.getElementById('auth-subtitle').textContent = 'Join the admin team';
    
    // Clear any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showForgotPassword() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'block';
    
    document.getElementById('auth-title').textContent = 'Reset Password';
    document.getElementById('auth-subtitle').textContent = 'Enter your email to reset password';
    
    // Clear any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    
    // Update admin name in header
    if (currentAdmin) {
        document.getElementById('admin-name').textContent = currentAdmin.name;
    }
    
    // Initialize admin panel
    initializeAdmin();
    setupNavigation();
    setupModals();
    loadDashboard();
    initializeNotificationSystem();
    setupRealTimeUpdates();
}

// Admin menu functions
function showAdminMenu() {
    const menu = document.getElementById('admin-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function showProfile() {
    document.getElementById('admin-menu').style.display = 'none';
    // Show profile modal (implement as needed)
    alert('Profile settings coming soon!');
}

function showSettings() {
    document.getElementById('admin-menu').style.display = 'none';
    // Show settings modal (implement as needed)
    alert('Settings panel coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear login state
        localStorage.removeItem('currentAdmin');
        localStorage.removeItem('rememberMe');
        
        currentAdmin = null;
        isAuthenticated = false;
        
        // Show auth screen
        showAuthScreen();
        showLogin();
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
        document.getElementById('forgot-form').reset();
    }
    
    document.getElementById('admin-menu').style.display = 'none';
}

function showTerms() {
    alert('Terms & Conditions:\n\n1. Admin access is restricted to authorized personnel only.\n2. Maintain confidentiality of customer data.\n3. Use admin privileges responsibly.\n4. Report any security issues immediately.\n5. Regular password updates are recommended.');
}

function showHelp() {
    alert('Need Help?\n\nFor admin access issues:\n📧 Email: admin@sparklejewels.com\n📞 Phone: +91 98765 43210\n\nDefault Admin Credentials:\nEmail: admin@sparklejewels.com\nPassword: admin123\n\nAdmin Access Codes:\n- SPARKLE2026\n- ADMIN123\n- JEWELS2026');
}

// Close admin menu when clicking outside
document.addEventListener('click', function(e) {
    const adminProfile = document.querySelector('.admin-profile');
    const adminMenu = document.getElementById('admin-menu');
    
    if (adminMenu && !adminProfile.contains(e.target)) {
        adminMenu.style.display = 'none';
    }
});

// Database Management System for Sparkle Jewels
class SparkleJewelsDB {
    constructor() {
        this.dbName = 'SparkleJewelsDB';
        this.version = 1;
        this.tables = {
            customers: 'customers',
            orders: 'orders',
            products: 'products',
            admins: 'admins',
            orderItems: 'orderItems',
            customerAddresses: 'customerAddresses',
            orderTracking: 'orderTracking'
        };
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Initialize all database tables
        this.initializeCustomers();
        this.initializeOrders();
        this.initializeProducts();
        this.initializeAdmins();
        this.initializeOrderItems();
        this.initializeCustomerAddresses();
        this.initializeOrderTracking();
    }

    // Customer Database Management
    initializeCustomers() {
        if (!localStorage.getItem('db_customers')) {
            const defaultCustomers = [];
            localStorage.setItem('db_customers', JSON.stringify(defaultCustomers));
        }
    }

    addCustomer(customerData) {
        const customers = this.getCustomers();
        const newCustomer = {
            id: this.generateId('CUST'),
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            dateOfBirth: customerData.dateOfBirth || null,
            gender: customerData.gender || null,
            registrationDate: new Date().toISOString(),
            lastOrderDate: null,
            totalOrders: 0,
            totalSpent: 0,
            status: 'active',
            preferences: {
                newsletter: true,
                smsUpdates: true,
                favoriteCategories: []
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        customers.push(newCustomer);
        localStorage.setItem('db_customers', JSON.stringify(customers));
        return newCustomer;
    }

    getCustomers() {
        return JSON.parse(localStorage.getItem('db_customers')) || [];
    }

    getCustomerById(id) {
        const customers = this.getCustomers();
        return customers.find(customer => customer.id === id);
    }

    getCustomerByEmail(email) {
        const customers = this.getCustomers();
        return customers.find(customer => customer.email === email);
    }

    updateCustomer(id, updateData) {
        const customers = this.getCustomers();
        const customerIndex = customers.findIndex(customer => customer.id === id);
        
        if (customerIndex !== -1) {
            customers[customerIndex] = {
                ...customers[customerIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('db_customers', JSON.stringify(customers));
            return customers[customerIndex];
        }
        return null;
    }

    // Order Database Management
    initializeOrders() {
        if (!localStorage.getItem('db_orders')) {
            const defaultOrders = [];
            localStorage.setItem('db_orders', JSON.stringify(defaultOrders));
        }
    }

    addOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: this.generateId('ORD'),
            orderId: Date.now(),
            trackingId: 'TRK' + Date.now().toString().slice(-6),
            customerId: orderData.customerId,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            shippingAddress: {
                street: orderData.address,
                city: orderData.city || '',
                state: orderData.state || '',
                pincode: orderData.pincode || '',
                country: 'India'
            },
            billingAddress: orderData.billingAddress || null,
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            tax: orderData.tax || 0,
            shippingCharges: orderData.shippingCharges || 0,
            discount: orderData.discount || 0,
            totalAmount: orderData.amount,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            orderType: orderData.orderType || 'single',
            notes: orderData.notes || '',
            estimatedDelivery: this.calculateEstimatedDelivery(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statusHistory: [{
                status: 'pending',
                timestamp: new Date().toISOString(),
                note: 'Order placed successfully'
            }]
        };
        
        orders.push(newOrder);
        localStorage.setItem('db_orders', JSON.stringify(orders));
        
        // Update customer statistics
        this.updateCustomerStats(orderData.customerId || orderData.customerEmail, newOrder);
        
        return newOrder;
    }

    getOrders() {
        return JSON.parse(localStorage.getItem('db_orders')) || [];
    }

    getOrderById(id) {
        const orders = this.getOrders();
        return orders.find(order => order.id === id || order.orderId.toString() === id.toString());
    }

    getOrderByTrackingId(trackingId) {
        const orders = this.getOrders();
        return orders.find(order => order.trackingId === trackingId);
    }

    getOrdersByCustomer(customerId) {
        const orders = this.getOrders();
        return orders.filter(order => order.customerId === customerId);
    }

    updateOrderStatus(orderId, newStatus, note = '') {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(order => order.orderId.toString() === orderId.toString());
        
        if (orderIndex !== -1) {
            orders[orderIndex].orderStatus = newStatus;
            orders[orderIndex].updatedAt = new Date().toISOString();
            
            // Add to status history
            orders[orderIndex].statusHistory.push({
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: note || `Order status updated to ${newStatus}`
            });
            
            // Add status-specific timestamps
            if (newStatus === 'processing') {
                orders[orderIndex].processingDate = new Date().toISOString();
            } else if (newStatus === 'shipped') {
                orders[orderIndex].shippedDate = new Date().toISOString();
            } else if (newStatus === 'delivered') {
                orders[orderIndex].deliveredDate = new Date().toISOString();
            }
            
            localStorage.setItem('db_orders', JSON.stringify(orders));
            return orders[orderIndex];
        }
        return null;
    }

    // Product Database Management
    initializeProducts() {
        if (!localStorage.getItem('db_products')) {
            const defaultProducts = [
                {
                    id: this.generateId('PROD'),
                    name: 'Golden Pearl Necklace',
                    category: 'necklaces',
                    price: 2999,
                    description: 'Beautiful golden pearl necklace for special occasions',
                    image: null,
                    sku: 'GPN001',
                    stock: 50,
                    sales: 15,
                    rating: 4.5,
                    reviews: [],
                    tags: ['golden', 'pearl', 'necklace', 'special'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId('PROD'),
                    name: 'Diamond Drop Earrings',
                    category: 'earrings',
                    price: 1599,
                    description: 'Elegant diamond drop earrings',
                    image: null,
                    sku: 'DDE002',
                    stock: 30,
                    sales: 12,
                    rating: 4.3,
                    reviews: [],
                    tags: ['diamond', 'earrings', 'elegant'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId('PROD'),
                    name: 'Silver Chain Bracelet',
                    category: 'bracelets',
                    price: 899,
                    description: 'Stylish silver chain bracelet',
                    image: null,
                    sku: 'SCB003',
                    stock: 25,
                    sales: 8,
                    rating: 4.2,
                    reviews: [],
                    tags: ['silver', 'bracelet', 'chain'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId('PROD'),
                    name: 'Royal Ruby Ring',
                    category: 'rings',
                    price: 1299,
                    description: 'Stunning royal ruby ring',
                    image: null,
                    sku: 'RRR004',
                    stock: 20,
                    sales: 10,
                    rating: 4.7,
                    reviews: [],
                    tags: ['ruby', 'ring', 'royal'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId('PROD'),
                    name: 'Heart Pendant Set',
                    category: 'necklaces',
                    price: 2199,
                    description: 'Romantic heart pendant necklace set',
                    image: null,
                    sku: 'HPS005',
                    stock: 15,
                    sales: 7,
                    rating: 4.4,
                    reviews: [],
                    tags: ['heart', 'pendant', 'romantic'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId('PROD'),
                    name: 'Star Stud Earrings',
                    category: 'earrings',
                    price: 799,
                    description: 'Cute star-shaped stud earrings',
                    image: null,
                    sku: 'SSE006',
                    stock: 40,
                    sales: 20,
                    rating: 4.1,
                    reviews: [],
                    tags: ['star', 'stud', 'earrings'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('db_products', JSON.stringify(defaultProducts));
        }
    }

    // Admin Database Management
    initializeAdmins() {
        if (!localStorage.getItem('db_admins')) {
            const defaultAdmins = [
                {
                    id: this.generateId('ADM'),
                    name: 'Super Admin',
                    email: 'admin@sparklejewels.com',
                    password: 'admin123',
                    role: 'super_admin',
                    permissions: ['all'],
                    isActive: true,
                    lastLogin: null,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('db_admins', JSON.stringify(defaultAdmins));
        }
    }

    // Utility Functions
    generateId(prefix = 'ID') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`;
    }

    calculateEstimatedDelivery() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
        return deliveryDate.toISOString();
    }

    updateCustomerStats(customerIdentifier, order) {
        let customer;
        
        if (customerIdentifier.includes('@')) {
            customer = this.getCustomerByEmail(customerIdentifier);
        } else {
            customer = this.getCustomerById(customerIdentifier);
        }
        
        if (customer) {
            customer.totalOrders += 1;
            customer.totalSpent += order.totalAmount;
            customer.lastOrderDate = order.createdAt;
            this.updateCustomer(customer.id, customer);
        }
    }

    // Database Statistics
    getDatabaseStats() {
        return {
            totalCustomers: this.getCustomers().length,
            totalOrders: this.getOrders().length,
            totalProducts: JSON.parse(localStorage.getItem('db_products') || '[]').length,
            totalRevenue: this.getOrders().reduce((sum, order) => sum + order.totalAmount, 0),
            ordersToday: this.getOrdersToday().length,
            newCustomersToday: this.getNewCustomersToday().length
        };
    }

    getOrdersToday() {
        const today = new Date().toDateString();
        return this.getOrders().filter(order => 
            new Date(order.createdAt).toDateString() === today
        );
    }

    getNewCustomersToday() {
        const today = new Date().toDateString();
        return this.getCustomers().filter(customer => 
            new Date(customer.registrationDate).toDateString() === today
        );
    }

    // Search Functions
    searchCustomers(query) {
        const customers = this.getCustomers();
        return customers.filter(customer => 
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query)
        );
    }

    searchOrders(query) {
        const orders = this.getOrders();
        return orders.filter(order => 
            order.orderId.toString().includes(query) ||
            order.trackingId.toLowerCase().includes(query.toLowerCase()) ||
            order.customerName.toLowerCase().includes(query.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Export Functions
    exportCustomersCSV() {
        const customers = this.getCustomers();
        const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Registration Date', 'Total Orders', 'Total Spent', 'Status'];
        
        const csvRows = [
            headers.join(','),
            ...customers.map(customer => [
                customer.id,
                `"${customer.name}"`,
                customer.email,
                customer.phone,
                new Date(customer.registrationDate).toLocaleDateString(),
                customer.totalOrders,
                customer.totalSpent,
                customer.status
            ].join(','))
        ];
        
        return csvRows.join('\n');
    }

    exportOrdersCSV() {
        const orders = this.getOrders();
        const headers = ['Order ID', 'Tracking ID', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status', 'Order Date', 'Payment Method'];
        
        const csvRows = [
            headers.join(','),
            ...orders.map(order => [
                order.orderId,
                order.trackingId,
                `"${order.customerName}"`,
                order.customerEmail,
                order.customerPhone,
                order.totalAmount,
                order.orderStatus,
                new Date(order.createdAt).toLocaleDateString(),
                order.paymentMethod
            ].join(','))
        ];
        
        return csvRows.join('\n');
    }

    // Initialize other tables
    initializeOrderItems() {
        if (!localStorage.getItem('db_orderItems')) {
            localStorage.setItem('db_orderItems', JSON.stringify([]));
        }
    }

    initializeCustomerAddresses() {
        if (!localStorage.getItem('db_customerAddresses')) {
            localStorage.setItem('db_customerAddresses', JSON.stringify([]));
        }
    }

    initializeOrderTracking() {
        if (!localStorage.getItem('db_orderTracking')) {
            localStorage.setItem('db_orderTracking', JSON.stringify([]));
        }
    }
}

// Initialize Database
const sparkleDB = new SparkleJewelsDB();

// Global variables for backward compatibility
let products = [];
let orders = [];
let customers = [];

// Live tracking variables
let liveTrackingInterval;
let isLiveTrackingActive = false;
let adminNotifications = [];

// Professional admin initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database and migrate existing data
    initializeDatabaseSystem();
    initializeAdmin();
    setupNavigation();
    setupModals();
    loadDashboard();
    initializeNotificationSystem();
    setupRealTimeUpdates();
});

// Database initialization and migration
function initializeDatabaseSystem() {
    console.log('Initializing Sparkle Jewels Database System...');
    
    // Migrate existing data to new database structure
    migrateExistingData();
    
    // Load data from database into global variables for backward compatibility
    refreshGlobalData();
    
    console.log('Database system initialized successfully!');
}

function migrateExistingData() {
    // Migrate existing orders
    const existingOrders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
    existingOrders.forEach(order => {
        // Check if order already exists in new database
        const existingDbOrder = sparkleDB.getOrderById(order.id);
        if (!existingDbOrder) {
            // Add customer first if not exists
            let customer = sparkleDB.getCustomerByEmail(order.customerEmail);
            if (!customer) {
                customer = sparkleDB.addCustomer({
                    name: order.customerName,
                    email: order.customerEmail,
                    phone: order.customerPhone
                });
            }
            
            // Add order to new database
            const orderData = {
                customerId: customer.id,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                address: order.address,
                items: order.items || [{
                    name: order.productName,
                    price: order.amount,
                    quantity: 1
                }],
                amount: order.amount,
                paymentMethod: order.paymentMethod || 'cod',
                orderType: order.orderType || 'single'
            };
            
            const newOrder = sparkleDB.addOrder(orderData);
            
            // Update status if different from pending
            if (order.status !== 'pending') {
                sparkleDB.updateOrderStatus(newOrder.orderId, order.status);
            }
        }
    });
    
    // Migrate existing customers
    const existingCustomers = JSON.parse(localStorage.getItem('jewelryCustomers')) || [];
    existingCustomers.forEach(customer => {
        const existingDbCustomer = sparkleDB.getCustomerByEmail(customer.email);
        if (!existingDbCustomer) {
            sparkleDB.addCustomer({
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            });
        }
    });
    
    // Products are already initialized in the database
    console.log('Data migration completed successfully!');
}

function refreshGlobalData() {
    // Load data from database for backward compatibility
    orders = sparkleDB.getOrders().map(order => ({
        id: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        address: order.shippingAddress.street,
        productName: order.items.length === 1 ? order.items[0].name : `${order.items.length} items`,
        amount: order.totalAmount,
        status: order.orderStatus,
        date: order.createdAt,
        trackingId: order.trackingId,
        paymentMethod: order.paymentMethod,
        orderType: order.orderType,
        items: order.items,
        processingDate: order.processingDate,
        shippedDate: order.shippedDate,
        deliveredDate: order.deliveredDate,
        lastNotificationSent: order.lastNotificationSent
    }));
    
    customers = sparkleDB.getCustomers().map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        joinDate: customer.registrationDate
    }));
    
    products = JSON.parse(localStorage.getItem('db_products')) || [];
    
    console.log(`Loaded ${orders.length} orders, ${customers.length} customers, ${products.length} products`);
}

function initializeAdmin() {
    // Save products to localStorage if not exists
    if (!localStorage.getItem('jewelryProducts')) {
        localStorage.setItem('jewelryProducts', JSON.stringify(products));
    }
    
    // Generate sample orders if none exist
    if (orders.length === 0) {
        generateSampleOrders();
    }
    
    // Generate sample customers if none exist
    if (customers.length === 0) {
        generateSampleCustomers();
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('href').substring(1);
            document.getElementById(targetSection).classList.add('active');
            
            // Update page title
            const pageTitle = this.textContent.trim();
            document.getElementById('page-title').textContent = pageTitle;
            
            // Load section data
            loadSectionData(targetSection);
        });
    });
}

function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

function loadDashboard() {
    // Get database statistics
    const dbStats = sparkleDB.getDatabaseStats();
    
    // Update stats using database
    document.getElementById('total-orders').textContent = dbStats.totalOrders;
    document.getElementById('total-customers').textContent = dbStats.totalCustomers;
    document.getElementById('total-revenue').textContent = `₹${dbStats.totalRevenue.toLocaleString()}`;
    document.getElementById('total-products').textContent = dbStats.totalProducts;
    
    // Add real-time indicators
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach(card => {
        if (!card.querySelector('.live-indicator-small')) {
            const liveIndicator = document.createElement('div');
            liveIndicator.className = 'live-indicator-small';
            liveIndicator.innerHTML = '<i class="fas fa-circle" style="color: #27ae60; font-size: 8px; animation: pulse 2s infinite;"></i>';
            card.appendChild(liveIndicator);
        }
    });
    
    // Load recent orders
    loadRecentOrders();
    
    // Add live tracking controls if not already present
    if (!document.querySelector('.live-controls')) {
        addLiveTrackingControls();
    }
    
    // Show today's highlights
    showTodaysHighlights(dbStats);
}

function showTodaysHighlights(stats) {
    const dashboard = document.getElementById('dashboard');
    let highlightsSection = dashboard.querySelector('.todays-highlights');
    
    if (!highlightsSection) {
        highlightsSection = document.createElement('div');
        highlightsSection.className = 'todays-highlights';
        highlightsSection.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-calendar-day"></i> Today's Highlights
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <div style="font-size: 2rem; font-weight: bold;">${stats.ordersToday}</div>
                        <div style="opacity: 0.9;">New Orders Today</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <div style="font-size: 2rem; font-weight: bold;">${stats.newCustomersToday}</div>
                        <div style="opacity: 0.9;">New Customers</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <div style="font-size: 2rem; font-weight: bold;">₹${sparkleDB.getOrdersToday().reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</div>
                        <div style="opacity: 0.9;">Today's Revenue</div>
                    </div>
                </div>
            </div>
        `;
        
        const statsGrid = dashboard.querySelector('.stats-grid');
        dashboard.insertBefore(highlightsSection, statsGrid.nextSibling);
    }
}

function loadRecentOrders() {
    const recentOrders = orders.slice(-5).reverse();
    const tbody = document.querySelector('#recent-orders-table tbody');
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.productName}</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function loadOrders() {
    const tbody = document.querySelector('#orders-table tbody');
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small>${order.customerEmail}</small><br>
                <small>${order.customerPhone}</small>
            </td>
            <td>${order.productName}</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="updateOrderStatus(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Setup status filter
    document.getElementById('status-filter').addEventListener('change', function() {
        filterOrdersByStatus(this.value);
    });
}

function loadCustomers() {
    const tbody = document.querySelector('#customers-table tbody');
    const dbCustomers = sparkleDB.getCustomers();
    
    tbody.innerHTML = dbCustomers.map(customer => {
        const customerOrders = sparkleDB.getOrdersByCustomer(customer.id);
        
        return `
            <tr>
                <td>
                    <strong>${customer.id}</strong><br>
                    <small style="color: #666;">Customer ID</small>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #f1c40f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>${customer.name}</strong><br>
                            <small style="color: #666;">${customer.email}</small><br>
                            <small style="color: #666;">${customer.phone}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${customer.totalOrders}</div>
                        <small style="color: #666;">Total Orders</small>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: bold; color: #27ae60;">₹${customer.totalSpent.toLocaleString()}</div>
                        <small style="color: #666;">Total Spent</small>
                    </div>
                </td>
                <td>
                    <div>
                        <div>${new Date(customer.registrationDate).toLocaleDateString()}</div>
                        <small style="color: #666;">Joined</small>
                    </div>
                </td>
                <td>
                    <div>
                        <div>${customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}</div>
                        <small style="color: #666;">Last Order</small>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${customer.status === 'active' ? 'status-delivered' : 'status-pending'}">${customer.status}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="action-btn" onclick="viewCustomerDetails('${customer.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="contactCustomer('${customer.id}')" title="Contact Customer" style="color: #3498db;">
                            <i class="fas fa-envelope"></i>
                        </button>
                        <button class="action-btn" onclick="viewCustomerOrders('${customer.id}')" title="View Orders" style="color: #e67e22;">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add customer search functionality
    addCustomerSearchFunctionality();
}

function addCustomerSearchFunctionality() {
    const customersSection = document.getElementById('customers');
    let searchBox = customersSection.querySelector('.customer-search');
    
    if (!searchBox) {
        searchBox = document.createElement('div');
        searchBox.className = 'customer-search';
        searchBox.innerHTML = `
            <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 1;">
                        <input type="text" id="customer-search-input" placeholder="Search customers by name, email, or phone..." 
                               style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <button onclick="searchCustomers()" class="btn-primary">
                        <i class="fas fa-search"></i> Search
                    </button>
                    <button onclick="exportCustomers()" class="btn-primary" style="background: #27ae60;">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        `;
        
        const table = customersSection.querySelector('.table-container');
        customersSection.insertBefore(searchBox, table);
        
        // Add real-time search
        document.getElementById('customer-search-input').addEventListener('input', function(e) {
            if (e.target.value.length >= 2 || e.target.value.length === 0) {
                searchCustomers();
            }
        });
    }
}

function searchCustomers() {
    const query = document.getElementById('customer-search-input').value.trim();
    const customers = query ? sparkleDB.searchCustomers(query) : sparkleDB.getCustomers();
    
    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = customers.map(customer => {
        return `
            <tr>
                <td>
                    <strong>${customer.id}</strong><br>
                    <small style="color: #666;">Customer ID</small>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #f1c40f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>${customer.name}</strong><br>
                            <small style="color: #666;">${customer.email}</small><br>
                            <small style="color: #666;">${customer.phone}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${customer.totalOrders}</div>
                        <small style="color: #666;">Total Orders</small>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: bold; color: #27ae60;">₹${customer.totalSpent.toLocaleString()}</div>
                        <small style="color: #666;">Total Spent</small>
                    </div>
                </td>
                <td>
                    <div>
                        <div>${new Date(customer.registrationDate).toLocaleDateString()}</div>
                        <small style="color: #666;">Joined</small>
                    </div>
                </td>
                <td>
                    <div>
                        <div>${customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}</div>
                        <small style="color: #666;">Last Order</small>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${customer.status === 'active' ? 'status-delivered' : 'status-pending'}">${customer.status}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="action-btn" onclick="viewCustomerDetails('${customer.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="contactCustomer('${customer.id}')" title="Contact Customer" style="color: #3498db;">
                            <i class="fas fa-envelope"></i>
                        </button>
                        <button class="action-btn" onclick="viewCustomerOrders('${customer.id}')" title="View Orders" style="color: #e67e22;">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    if (query && customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No customers found matching "${query}"</p>
                </td>
            </tr>
        `;
    }
}

function loadProducts() {
    // Refresh products from localStorage
    products = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    
    const grid = document.getElementById('products-grid');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}">` : 
                    `<i class="fas fa-gem"></i>`
                }
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <p>${product.description}</p>
                <div class="product-actions">
                    <button class="action-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAnalytics() {
    // Load top products
    const topProductsList = document.getElementById('top-products-list');
    const sortedProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
    
    topProductsList.innerHTML = sortedProducts.map(product => `
        <div class="top-product-item">
            <span>${product.name}</span>
            <span><strong>${product.sales} sales</strong></span>
        </div>
    `).join('');
}

// Order management functions
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    // Handle both single item and multi-item orders
    const orderItemsHtml = order.items ? 
        order.items.map(item => `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 0.5rem 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${item.name}</strong>
                        <p style="color: #666; margin: 5px 0;">Quantity: ${item.quantity}</p>
                        <p style="color: #d4af37; font-weight: bold;">₹${item.price.toLocaleString()} each</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: bold; color: #2c3e50;">₹${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `).join('') :
        `<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
            <strong>${order.productName}</strong>
            <p style="color: #d4af37; font-weight: bold; margin-top: 5px;">₹${order.amount.toLocaleString()}</p>
        </div>`;
    
    content.innerHTML = `
        <div class="order-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                        <i class="fas fa-shopping-bag"></i> Order Information
                    </h4>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
                    <p><strong>Order Type:</strong> ${order.orderType || 'single'} ${order.orderType === 'cart' ? '(Multiple Items)' : '(Single Item)'}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()} ${new Date(order.date).toLocaleTimeString()}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                </div>
                
                <div>
                    <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                        <i class="fas fa-user"></i> Customer Information
                    </h4>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone}</p>
                    <p><strong>Address:</strong></p>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                        ${order.address}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                    <i class="fas fa-gem"></i> Order Items
                </h4>
                ${orderItemsHtml}
                <div style="text-align: right; margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                    <h3 style="color: #27ae60; margin: 0;">Total Amount: ₹${order.amount.toLocaleString()}</h3>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                    <i class="fas fa-cogs"></i> Order Management
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <button onclick="updateOrderStatus(${order.id})" class="btn-primary" style="padding: 10px;">
                        <i class="fas fa-arrow-up"></i> Update Status
                    </button>
                    <button onclick="sendCustomerUpdate(${order.id})" class="btn-primary" style="background: #3498db;">
                        <i class="fas fa-envelope"></i> Notify Customer
                    </button>
                    <button onclick="printOrderDetails(${order.id})" class="btn-primary" style="background: #9b59b6;">
                        <i class="fas fa-print"></i> Print Order
                    </button>
                    <button onclick="trackOrderLocation(${order.id})" class="btn-primary" style="background: #e67e22;">
                        <i class="fas fa-map-marker-alt"></i> Track Location
                    </button>
                </div>
            </div>
            
            <div>
                <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                    <i class="fas fa-history"></i> Order Timeline
                </h4>
                <div id="order-timeline-${order.id}">
                    ${generateOrderTimeline(order)}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function updateOrderStatus(orderId) {
    const order = sparkleDB.getOrderById(orderId);
    if (!order) return;
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.orderStatus);
    const nextStatus = statuses[currentIndex + 1] || statuses[0];
    
    // Update status in database
    const updatedOrder = sparkleDB.updateOrderStatus(order.orderId, nextStatus);
    
    if (updatedOrder) {
        // Refresh global data
        refreshGlobalData();
        
        // Refresh views
        loadOrders();
        loadDashboard();
        
        // Show notification with next steps
        showProfessionalNotification(
            `Order #${orderId} status updated to ${nextStatus}. Consider notifying the customer.`, 
            'success'
        );
        
        // Auto-suggest customer notification
        setTimeout(() => {
            if (confirm(`Would you like to send an update notification to the customer about the status change?`)) {
                sendCustomerUpdate(orderId);
            }
        }, 2000);
    }
}

function filterOrdersByStatus(status) {
    const tbody = document.querySelector('#orders-table tbody');
    const filteredOrders = status === 'all' ? orders : orders.filter(order => order.status === status);
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small>${order.customerEmail}</small><br>
                <small>${order.customerPhone}</small>
            </td>
            <td>${order.productName}</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="updateOrderStatus(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Product management functions
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });
    
    // Image upload preview
    setupImageUpload();
}

function showAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'none';
    document.getElementById('add-product-form').reset();
    
    // Reset image preview
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '<span class="empty">No image selected</span>';
    imagePreview.classList.add('empty');
}

function addNewProduct() {
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseInt(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    // Generate proper ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                id: newId,
                name,
                category,
                price,
                description,
                sales: 0,
                image: e.target.result
            };
            
            products.push(newProduct);
            localStorage.setItem('jewelryProducts', JSON.stringify(products));
            
            // Update all views
            loadProducts();
            loadDashboard();
            closeAddProductModal();
            
            showNotification('Product added successfully!');
            
            // Trigger customer site update if it's open
            window.dispatchEvent(new CustomEvent('productsUpdated'));
        };
        reader.readAsDataURL(imageFile);
    } else {
        const newProduct = {
            id: newId,
            name,
            category,
            price,
            description,
            sales: 0,
            image: null
        };
        
        products.push(newProduct);
        localStorage.setItem('jewelryProducts', JSON.stringify(products));
        
        // Update all views
        loadProducts();
        loadDashboard();
        closeAddProductModal();
        
        showNotification('Product added successfully!');
        
        // Trigger customer site update if it's open
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    
    // Show existing image if available
    const imagePreview = document.getElementById('image-preview');
    if (product.image) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="Current product image">`;
        imagePreview.classList.remove('empty');
    } else {
        imagePreview.innerHTML = '<span class="empty">No image selected</span>';
        imagePreview.classList.add('empty');
    }
    
    showAddProductModal();
    
    // Change form behavior to edit mode
    const form = document.getElementById('add-product-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateProduct(productId);
    };
}

function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseInt(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.name = name;
            product.category = category;
            product.price = price;
            product.description = description;
            product.image = e.target.result;
            
            localStorage.setItem('jewelryProducts', JSON.stringify(products));
            
            loadProducts();
            closeAddProductModal();
            
            showNotification('Product updated successfully!');
            
            // Reset form behavior
            document.getElementById('add-product-form').onsubmit = function(e) {
                e.preventDefault();
                addNewProduct();
            };
        };
        reader.readAsDataURL(imageFile);
    } else {
        product.name = name;
        product.category = category;
        product.price = price;
        product.description = description;
        // Keep existing image if no new image selected
        
        localStorage.setItem('jewelryProducts', JSON.stringify(products));
        
        loadProducts();
        closeAddProductModal();
        
        showNotification('Product updated successfully!');
        
        // Reset form behavior
        document.getElementById('add-product-form').onsubmit = function(e) {
            e.preventDefault();
            addNewProduct();
        };
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('jewelryProducts', JSON.stringify(products));
        
        loadProducts();
        loadDashboard();
        
        showNotification('Product deleted successfully!');
    }
}

// Utility functions
function generateSampleOrders() {
    const sampleOrders = [
        {
            id: 1001,
            customerName: 'Priya Sharma',
            customerEmail: 'priya@email.com',
            customerPhone: '+91 98765 43210',
            address: '123 MG Road, Mumbai 400001',
            productName: 'Golden Pearl Necklace',
            amount: 2999,
            status: 'delivered',
            date: new Date(2026, 0, 15).toISOString(),
            trackingId: 'TRK001'
        },
        {
            id: 1002,
            customerName: 'Anjali Patel',
            customerEmail: 'anjali@email.com',
            customerPhone: '+91 87654 32109',
            address: '456 Park Street, Delhi 110001',
            productName: 'Diamond Drop Earrings',
            amount: 1599,
            status: 'shipped',
            date: new Date(2026, 0, 20).toISOString(),
            trackingId: 'TRK002'
        },
        {
            id: 1003,
            customerName: 'Kavya Singh',
            customerEmail: 'kavya@email.com',
            customerPhone: '+91 76543 21098',
            address: '789 Brigade Road, Bangalore 560001',
            productName: 'Royal Ruby Ring',
            amount: 1299,
            status: 'processing',
            date: new Date(2026, 0, 25).toISOString(),
            trackingId: 'TRK003'
        },
        {
            id: 1004,
            customerName: 'Meera Gupta',
            customerEmail: 'meera@email.com',
            customerPhone: '+91 65432 10987',
            address: '321 Anna Salai, Chennai 600001',
            productName: 'Heart Pendant Set',
            amount: 2199,
            status: 'pending',
            date: new Date(2026, 0, 27).toISOString(),
            trackingId: 'TRK004'
        }
    ];
    
    orders = sampleOrders;
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
}

function generateSampleCustomers() {
    const sampleCustomers = [
        {
            id: 1,
            name: 'Priya Sharma',
            email: 'priya@email.com',
            phone: '+91 98765 43210',
            joinDate: new Date(2025, 11, 15).toISOString()
        },
        {
            id: 2,
            name: 'Anjali Patel',
            email: 'anjali@email.com',
            phone: '+91 87654 32109',
            joinDate: new Date(2025, 11, 20).toISOString()
        },
        {
            id: 3,
            name: 'Kavya Singh',
            email: 'kavya@email.com',
            phone: '+91 76543 21098',
            joinDate: new Date(2026, 0, 5).toISOString()
        },
        {
            id: 4,
            name: 'Meera Gupta',
            email: 'meera@email.com',
            phone: '+91 65432 10987',
            joinDate: new Date(2026, 0, 10).toISOString()
        }
    ];
    
    customers = sampleCustomers;
    localStorage.setItem('jewelryCustomers', JSON.stringify(customers));
}

function showNotification(message, type = 'success') {
    showProfessionalNotification(message, type);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-center {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10001;
        max-width: 350px;
    }
    
    .notification-item {
        background: white;
        border-left: 4px solid #d4af37;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-item.success {
        border-left-color: #27ae60;
    }
    
    .notification-item.warning {
        border-left-color: #f39c12;
    }
    
    .notification-item.error {
        border-left-color: #e74c3c;
    }
    
    .admin-stats-realtime {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: #27ae60;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);

// Professional notification system
function initializeNotificationSystem() {
    const notificationCenter = document.createElement('div');
    notificationCenter.className = 'notification-center';
    notificationCenter.id = 'notification-center';
    document.body.appendChild(notificationCenter);
}

function showProfessionalNotification(message, type = 'info', duration = 4000) {
    const notificationCenter = document.getElementById('notification-center');
    const notification = document.createElement('div');
    notification.className = `notification-item ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 
                 type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${icon}"></i>
            <div>
                <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">${message}</p>
            </div>
        </div>
    `;
    
    notificationCenter.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Real-time updates system
function setupRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        if (document.querySelector('#dashboard.active')) {
            updateRealTimeStats();
        }
    }, 30000);
    
    // Check for new orders every 15 seconds
    setInterval(() => {
        checkForNewOrders();
    }, 15000);
}

// Generate order timeline
function generateOrderTimeline(order) {
    const timeline = [
        { status: 'pending', label: 'Order Placed', icon: 'fa-shopping-cart', time: order.date },
        { status: 'processing', label: 'Processing', icon: 'fa-cog', time: order.processingDate },
        { status: 'shipped', label: 'Shipped', icon: 'fa-truck', time: order.shippedDate },
        { status: 'delivered', label: 'Delivered', icon: 'fa-check-circle', time: order.deliveredDate }
    ];
    
    const currentStatusIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
    
    return timeline.map((step, index) => {
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        
        return `
            <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                <div class="timeline-icon">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h5>${step.label}</h5>
                    <p>${step.time ? new Date(step.time).toLocaleString() : 'Pending'}</p>
                    ${isCurrent ? '<span class="current-status">Current Status</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Send customer update notification
function sendCustomerUpdate(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const updateModal = document.createElement('div');
    updateModal.className = 'modal';
    updateModal.style.display = 'block';
    
    updateModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3><i class="fas fa-envelope"></i> Send Customer Update</h3>
            <div style="margin: 2rem 0;">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Order:</strong> #${order.id}</p>
                <p><strong>Current Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Update Message:</label>
                <textarea id="update-message" style="width: 100%; height: 100px; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" 
                          placeholder="Enter update message for customer...">${getDefaultUpdateMessage(order)}</textarea>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="this.closest('.modal').remove()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="sendUpdateToCustomer(${orderId})" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-paper-plane"></i> Send Update
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(updateModal);
}

function getDefaultUpdateMessage(order) {
    const messages = {
        'pending': `Dear ${order.customerName}, your order #${order.id} has been received and is being processed. We'll update you once it's ready for shipment.`,
        'processing': `Dear ${order.customerName}, your order #${order.id} is currently being prepared for shipment. Expected shipping date: ${new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}.`,
        'shipped': `Great news ${order.customerName}! Your order #${order.id} has been shipped. Track with ID: ${order.trackingId}. Expected delivery: 2-3 business days.`,
        'delivered': `Dear ${order.customerName}, your order #${order.id} has been delivered successfully. Thank you for choosing Sparkle Jewels! Please rate your experience.`
    };
    
    return messages[order.status] || `Update regarding your order #${order.id}`;
}

function sendUpdateToCustomer(orderId) {
    const order = orders.find(o => o.id === orderId);
    const message = document.getElementById('update-message').value;
    
    if (!message.trim()) {
        showProfessionalNotification('Please enter an update message', 'warning');
        return;
    }
    
    // Simulate sending email/SMS
    const update = {
        orderId: orderId,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        message: message,
        sentAt: new Date().toISOString(),
        sentBy: 'Admin'
    };
    
    // Store customer updates
    let customerUpdates = JSON.parse(localStorage.getItem('customerUpdates')) || [];
    customerUpdates.push(update);
    localStorage.setItem('customerUpdates', JSON.stringify(customerUpdates));
    
    // Close modal
    document.querySelector('#update-message').closest('.modal').remove();
    
    // Show success notification
    showProfessionalNotification(`Update sent to ${order.customerName} successfully!`, 'success');
    
    // Update order with notification sent flag
    order.lastNotificationSent = new Date().toISOString();
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
}

// Print order details
function printOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    const orderItemsHtml = order.items ? 
        order.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toLocaleString()}</td>
                <td>₹${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('') :
        `<tr>
            <td>${order.productName}</td>
            <td>1</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td>₹${order.amount.toLocaleString()}</td>
        </tr>`;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Order #${order.id} - Sparkle Jewels</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
                .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
                .section { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                .section h3 { color: #2c3e50; margin-bottom: 10px; border-bottom: 1px solid #d4af37; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background: #d4af37; color: white; }
                .total { text-align: right; font-size: 1.2rem; font-weight: bold; color: #27ae60; }
                .footer { margin-top: 30px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌟 SPARKLE JEWELS</h1>
                <h2>Order Invoice</h2>
                <p>Premium Artificial Jewelry</p>
            </div>
            
            <div class="order-info">
                <div class="section">
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
                
                <div class="section">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone}</p>
                    <p><strong>Address:</strong><br>${order.address}</p>
                </div>
            </div>
            
            <h3>Order Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
            </table>
            
            <div class="total">
                <p>Total Amount: ₹${order.amount.toLocaleString()}</p>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing Sparkle Jewels!</p>
                <p>📞 Customer Support: +91 98765 43210 | 📧 info@sparklejewels.com</p>
                <p>🌐 www.sparklejewels.com</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Track order location
function trackOrderLocation(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const locationModal = document.createElement('div');
    locationModal.className = 'modal';
    locationModal.style.display = 'block';
    
    locationModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3><i class="fas fa-map-marker-alt"></i> Track Order Location</h3>
            
            <div style="margin: 2rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><strong>Order:</strong> #${order.id} - ${order.customerName}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                    <p><strong>Destination:</strong> ${order.address}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <i class="fas fa-truck" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;"></i>
                    <h4 style="color: #27ae60; margin-bottom: 1rem;">Current Location</h4>
                    ${getOrderLocationInfo(order)}
                </div>
                
                <div style="margin-top: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Delivery Timeline</h4>
                    ${generateDeliveryTimeline(order)}
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="refreshOrderLocation(${orderId})" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-sync-alt"></i> Refresh Location
                </button>
                <button onclick="this.closest('.modal').remove()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(locationModal);
}

function getOrderLocationInfo(order) {
    const locations = {
        'pending': '<p>📦 Order is being prepared at our warehouse</p><p style="color: #666;">Mumbai Warehouse, Maharashtra</p>',
        'processing': '<p>🏭 Order is being processed and packed</p><p style="color: #666;">Processing Center, Mumbai</p>',
        'shipped': '<p>🚛 Order is in transit</p><p style="color: #666;">Last seen: Delhi Distribution Center</p><p style="color: #666;">Next: Local delivery hub</p>',
        'delivered': '<p>✅ Order delivered successfully</p><p style="color: #666;">Delivered to customer address</p>'
    };
    
    return locations[order.status] || '<p>Location information not available</p>';
}

function generateDeliveryTimeline(order) {
    const estimatedDays = {
        'pending': 'Processing: 1-2 days',
        'processing': 'Shipping: 1-2 days',
        'shipped': 'Delivery: 1-2 days',
        'delivered': 'Delivered ✅'
    };
    
    return `
        <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
            <p><strong>Estimated Timeline:</strong></p>
            <p style="color: #2c3e50; margin: 5px 0;">${estimatedDays[order.status]}</p>
            <p style="color: #666; font-size: 0.9rem;">Total delivery time: 3-5 business days from order placement</p>
        </div>
    `;
}

function refreshOrderLocation(orderId) {
    showProfessionalNotification('Location information refreshed', 'info');
    // In a real app, this would fetch updated location data
}

// Search orders functionality
function searchOrders(query) {
    const filteredOrders = orders.filter(order => 
        order.id.toString().includes(query) ||
        order.trackingId.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(query.toLowerCase()) ||
        order.productName.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredOrders(filteredOrders);
}

function displayFilteredOrders(filteredOrders) {
    const tbody = document.querySelector('#orders-table tbody');
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>
                <strong>#${order.id}</strong><br>
                <small style="color: #666;">${order.trackingId}</small>
            </td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small>${order.customerEmail}</small><br>
                <small>${order.customerPhone}</small>
            </td>
            <td>
                ${order.productName}
                ${order.orderType === 'cart' ? '<br><small style="color: #d4af37;">Multiple Items</small>' : ''}
            </td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td>
                <span class="status-badge status-${order.status}">${order.status}</span>
                ${order.lastNotificationSent ? '<br><small style="color: #27ae60;"><i class="fas fa-check"></i> Notified</small>' : ''}
            </td>
            <td>
                ${new Date(order.date).toLocaleDateString()}<br>
                <small>${new Date(order.date).toLocaleTimeString()}</small>
            </td>
            <td>
                <button class="action-btn" onclick="viewOrderDetails(${order.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="updateOrderStatus(${order.id})" title="Update Status">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="sendCustomerUpdate(${order.id})" title="Notify Customer" style="color: #3498db;">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="action-btn" onclick="trackOrderLocation(${order.id})" title="Track Location" style="color: #e67e22;">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Customer Management Functions
function viewCustomerDetails(customerId) {
    const customer = sparkleDB.getCustomerById(customerId);
    if (!customer) return;
    
    const customerOrders = sparkleDB.getOrdersByCustomer(customerId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.remove()">&times;</span>
            <h3><i class="fas fa-user"></i> Customer Details</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                        <i class="fas fa-info-circle"></i> Personal Information
                    </h4>
                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
                        <p><strong>Customer ID:</strong> ${customer.id}</p>
                        <p><strong>Name:</strong> ${customer.name}</p>
                        <p><strong>Email:</strong> ${customer.email}</p>
                        <p><strong>Phone:</strong> ${customer.phone}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${customer.status === 'active' ? 'status-delivered' : 'status-pending'}">${customer.status}</span></p>
                        <p><strong>Registration Date:</strong> ${new Date(customer.registrationDate).toLocaleDateString()}</p>
                        ${customer.dateOfBirth ? `<p><strong>Date of Birth:</strong> ${new Date(customer.dateOfBirth).toLocaleDateString()}</p>` : ''}
                        ${customer.gender ? `<p><strong>Gender:</strong> ${customer.gender}</p>` : ''}
                    </div>
                </div>
                
                <div>
                    <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                        <i class="fas fa-chart-line"></i> Order Statistics
                    </h4>
                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
                        <p><strong>Total Orders:</strong> ${customer.totalOrders}</p>
                        <p><strong>Total Spent:</strong> ₹${customer.totalSpent.toLocaleString()}</p>
                        <p><strong>Average Order Value:</strong> ₹${customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() : '0'}</p>
                        <p><strong>Last Order:</strong> ${customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}</p>
                        <p><strong>Favorite Categories:</strong> ${customer.preferences.favoriteCategories.length > 0 ? customer.preferences.favoriteCategories.join(', ') : 'None yet'}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">
                    <i class="fas fa-shopping-bag"></i> Recent Orders (${customerOrders.length})
                </h4>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${customerOrders.length > 0 ? customerOrders.slice(0, 5).map(order => `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #d4af37;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>Order #${order.orderId}</strong>
                                    <p style="margin: 5px 0; color: #666;">Tracking: ${order.trackingId}</p>
                                    <p style="margin: 5px 0; color: #666;">${new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="font-weight: bold; color: #27ae60;">₹${order.totalAmount.toLocaleString()}</p>
                                    <span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #666; padding: 2rem;">No orders found</p>'}
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="contactCustomer('${customerId}')" class="btn-primary" style="background: #3498db;">
                    <i class="fas fa-envelope"></i> Contact Customer
                </button>
                <button onclick="viewCustomerOrders('${customerId}')" class="btn-primary" style="background: #e67e22;">
                    <i class="fas fa-shopping-bag"></i> View All Orders
                </button>
                <button onclick="this.closest('.modal').remove()" class="btn-primary" style="background: #95a5a6;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function contactCustomer(customerId) {
    const customer = sparkleDB.getCustomerById(customerId);
    if (!customer) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.remove()">&times;</span>
            <h3><i class="fas fa-envelope"></i> Contact Customer</h3>
            
            <div style="margin: 2rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><strong>Customer:</strong> ${customer.name}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Message Type:</label>
                    <select id="message-type" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="general">General Inquiry</option>
                        <option value="order-update">Order Update</option>
                        <option value="promotion">Promotional Offer</option>
                        <option value="feedback">Feedback Request</option>
                        <option value="support">Customer Support</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Message:</label>
                    <textarea id="customer-message" style="width: 100%; height: 120px; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" 
                              placeholder="Enter your message to the customer...">Dear ${customer.name},

Thank you for choosing Sparkle Jewels! We hope you're enjoying your jewelry.

Best regards,
Sparkle Jewels Team</textarea>
                </div>
                
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" id="send-email" checked> Send Email
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" id="send-sms"> Send SMS
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="this.closest('.modal').remove()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="sendCustomerMessage('${customerId}')" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-paper-plane"></i> Send Message
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function sendCustomerMessage(customerId) {
    const customer = sparkleDB.getCustomerById(customerId);
    const messageType = document.getElementById('message-type').value;
    const message = document.getElementById('customer-message').value;
    const sendEmail = document.getElementById('send-email').checked;
    const sendSms = document.getElementById('send-sms').checked;
    
    if (!message.trim()) {
        showProfessionalNotification('Please enter a message', 'warning');
        return;
    }
    
    // Simulate sending message
    const messageRecord = {
        customerId: customerId,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        messageType: messageType,
        message: message,
        sendEmail: sendEmail,
        sendSms: sendSms,
        sentAt: new Date().toISOString(),
        sentBy: currentAdmin ? currentAdmin.name : 'Admin'
    };
    
    // Store message record
    let customerMessages = JSON.parse(localStorage.getItem('customerMessages')) || [];
    customerMessages.push(messageRecord);
    localStorage.setItem('customerMessages', JSON.stringify(customerMessages));
    
    // Close modal
    document.querySelector('#customer-message').closest('.modal').remove();
    
    // Show success notification
    const channels = [];
    if (sendEmail) channels.push('Email');
    if (sendSms) channels.push('SMS');
    
    showProfessionalNotification(
        `Message sent to ${customer.name} via ${channels.join(' and ')}!`, 
        'success'
    );
}

function viewCustomerOrders(customerId) {
    const customer = sparkleDB.getCustomerById(customerId);
    const customerOrders = sparkleDB.getOrdersByCustomer(customerId);
    
    if (!customer) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <span class="close" onclick="this.remove()">&times;</span>
            <h3><i class="fas fa-shopping-bag"></i> ${customer.name}'s Orders (${customerOrders.length})</h3>
            
            <div style="margin: 2rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${customerOrders.length}</div>
                            <div style="color: #666;">Total Orders</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">₹${customer.totalSpent.toLocaleString()}</div>
                            <div style="color: #666;">Total Spent</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; font-weight: bold; color: #3498db;">₹${customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() : '0'}</div>
                            <div style="color: #666;">Avg Order Value</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; font-weight: bold; color: #e67e22;">${customerOrders.filter(o => o.orderStatus === 'delivered').length}</div>
                            <div style="color: #666;">Completed</div>
                        </div>
                    </div>
                </div>
                
                <div style="max-height: 400px; overflow-y: auto;">
                    ${customerOrders.length > 0 ? customerOrders.map(order => `
                        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: center;">
                                <div>
                                    <strong>Order #${order.orderId}</strong>
                                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;">Tracking: ${order.trackingId}</p>
                                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;">${new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p style="margin: 0; font-weight: bold;">${order.items.length === 1 ? order.items[0].name : `${order.items.length} items`}</p>
                                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                                </div>
                                <div style="text-align: center;">
                                    <p style="font-weight: bold; color: #27ae60; margin: 0;">₹${order.totalAmount.toLocaleString()}</p>
                                    <span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span>
                                </div>
                                <div>
                                    <button onclick="viewOrderDetails(${order.orderId})" class="action-btn" title="View Order Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #666; padding: 3rem;">No orders found for this customer</p>'}
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="this.closest('.modal').remove()" class="btn-primary" style="background: #95a5a6;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function exportCustomers() {
    const csvContent = sparkleDB.exportCustomersCSV();
    downloadCSV(csvContent, 'sparkle-jewels-customers.csv');
    showProfessionalNotification('Customer data exported successfully!', 'success');
}

function generateOrdersCSV() {
    const headers = ['Order ID', 'Tracking ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Amount', 'Status', 'Order Date', 'Address'];
    
    const csvRows = [
        headers.join(','),
        ...orders.map(order => [
            order.id,
            order.trackingId,
            `"${order.customerName}"`,
            order.customerEmail,
            order.customerPhone,
            `"${order.productName}"`,
            order.amount,
            order.status,
            new Date(order.date).toLocaleDateString(),
            `"${order.address.replace(/"/g, '""')}"`
        ].join(','))
    ];
    
    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Enhanced order status update with timestamps
function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[currentIndex + 1] || statuses[0];
    
    // Update status with timestamp
    order.status = nextStatus;
    order.lastUpdated = new Date().toISOString();
    
    // Add status-specific timestamps
    if (nextStatus === 'processing') {
        order.processingDate = new Date().toISOString();
    } else if (nextStatus === 'shipped') {
        order.shippedDate = new Date().toISOString();
    } else if (nextStatus === 'delivered') {
        order.deliveredDate = new Date().toISOString();
    }
    
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
    
    loadOrders();
    loadDashboard();
    
    // Show notification with next steps
    showProfessionalNotification(
        `Order #${orderId} status updated to ${nextStatus}. Consider notifying the customer.`, 
        'success'
    );
    
    // Auto-suggest customer notification
    setTimeout(() => {
        if (confirm(`Would you like to send an update notification to the customer about the status change?`)) {
            sendCustomerUpdate(orderId);
        }
    }, 2000);
}

function updateRealTimeStats() {
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const revenueElement = document.getElementById('total-revenue');
    
    if (revenueElement) {
        revenueElement.innerHTML = `
            ₹${totalRevenue.toLocaleString()}
            <div class="admin-stats-realtime">
                <i class="fas fa-sync-alt fa-spin"></i>
                <span>Live</span>
            </div>
        `;
    }
}

function checkForNewOrders() {
    const currentOrders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
    
    if (currentOrders.length > orders.length) {
        const newOrdersCount = currentOrders.length - orders.length;
        showProfessionalNotification(
            `${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received!`, 
            'success'
        );
        
        orders = currentOrders;
        
        // Refresh dashboard if active
        if (document.querySelector('#dashboard.active')) {
            loadDashboard();
        }
        
        // Refresh orders view if active
        if (document.querySelector('#orders.active')) {
            loadOrders();
        }
    }
}

// Image upload functionality
function setupImageUpload() {
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    
    imagePreview.innerHTML = '<span class="empty">No image selected</span>';
    imagePreview.classList.add('empty');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product preview">`;
                imagePreview.classList.remove('empty');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '<span class="empty">No image selected</span>';
            imagePreview.classList.add('empty');
        }
    });
}

// Live tracking functionality
function startLiveTracking() {
    if (isLiveTrackingActive) return;
    
    isLiveTrackingActive = true;
    
    // Add live indicator to header
    const headerActions = document.querySelector('.header-actions');
    const liveIndicator = document.createElement('div');
    liveIndicator.className = 'live-indicator';
    liveIndicator.innerHTML = '<div class="live-dot"></div><span>Live Tracking Active</span>';
    headerActions.insertBefore(liveIndicator, headerActions.firstChild);
    
    // Simulate live updates every 30 seconds
    liveTrackingInterval = setInterval(() => {
        simulateOrderUpdates();
        updateLiveStats();
    }, 30000);
    
    showNotification('Live tracking started!');
}

function stopLiveTracking() {
    if (!isLiveTrackingActive) return;
    
    isLiveTrackingActive = false;
    
    // Remove live indicator
    const liveIndicator = document.querySelector('.live-indicator');
    if (liveIndicator) {
        liveIndicator.remove();
    }
    
    // Clear interval
    if (liveTrackingInterval) {
        clearInterval(liveTrackingInterval);
    }
    
    showNotification('Live tracking stopped!');
}

function simulateOrderUpdates() {
    // Simulate random order status updates
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const processingOrders = orders.filter(order => order.status === 'processing');
    const shippedOrders = orders.filter(order => order.status === 'shipped');
    
    // Update some pending orders to processing
    if (pendingOrders.length > 0 && Math.random() > 0.7) {
        const randomOrder = pendingOrders[Math.floor(Math.random() * pendingOrders.length)];
        randomOrder.status = 'processing';
        randomOrder.lastUpdated = new Date().toISOString();
    }
    
    // Update some processing orders to shipped
    if (processingOrders.length > 0 && Math.random() > 0.8) {
        const randomOrder = processingOrders[Math.floor(Math.random() * processingOrders.length)];
        randomOrder.status = 'shipped';
        randomOrder.lastUpdated = new Date().toISOString();
    }
    
    // Update some shipped orders to delivered
    if (shippedOrders.length > 0 && Math.random() > 0.9) {
        const randomOrder = shippedOrders[Math.floor(Math.random() * shippedOrders.length)];
        randomOrder.status = 'delivered';
        randomOrder.lastUpdated = new Date().toISOString();
    }
    
    // Save updated orders
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
    
    // Refresh current view if on orders or dashboard
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        const sectionId = activeSection.id;
        if (sectionId === 'dashboard' || sectionId === 'orders') {
            loadSectionData(sectionId);
        }
    }
}

function updateLiveStats() {
    // Update dashboard stats in real-time
    if (document.querySelector('#dashboard.active')) {
        loadDashboard();
    }
}

// Add live tracking controls to dashboard
function addLiveTrackingControls() {
    const dashboard = document.getElementById('dashboard');
    const statsGrid = dashboard.querySelector('.stats-grid');
    
    const liveControls = document.createElement('div');
    liveControls.className = 'live-controls';
    liveControls.innerHTML = `
        <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: #2c3e50;">Live Tracking Controls</h4>
            <div style="display: flex; gap: 1rem;">
                <button onclick="startLiveTracking()" class="btn-primary">
                    <i class="fas fa-play"></i> Start Live Tracking
                </button>
                <button onclick="stopLiveTracking()" class="btn-primary" style="background: #e74c3c;">
                    <i class="fas fa-stop"></i> Stop Live Tracking
                </button>
            </div>
        </div>
    `;
    
    dashboard.insertBefore(liveControls, statsGrid);
}
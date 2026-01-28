// Admin Panel JavaScript

// Sample data storage (in real app, this would be a database)
let orders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
let customers = JSON.parse(localStorage.getItem('jewelryCustomers')) || [];
let products = JSON.parse(localStorage.getItem('jewelryProducts')) || [
    {
        id: 1,
        name: 'Golden Pearl Necklace',
        category: 'necklaces',
        price: 2999,
        description: 'Beautiful golden pearl necklace for special occasions',
        sales: 15,
        image: null
    },
    {
        id: 2,
        name: 'Diamond Drop Earrings',
        category: 'earrings',
        price: 1599,
        description: 'Elegant diamond drop earrings',
        sales: 12,
        image: null
    },
    {
        id: 3,
        name: 'Silver Chain Bracelet',
        category: 'bracelets',
        price: 899,
        description: 'Stylish silver chain bracelet',
        sales: 8,
        image: null
    },
    {
        id: 4,
        name: 'Royal Ruby Ring',
        category: 'rings',
        price: 1299,
        description: 'Stunning royal ruby ring',
        sales: 10,
        image: null
    },
    {
        id: 5,
        name: 'Heart Pendant Set',
        category: 'necklaces',
        price: 2199,
        description: 'Romantic heart pendant necklace set',
        sales: 7,
        image: null
    },
    {
        id: 6,
        name: 'Star Stud Earrings',
        category: 'earrings',
        price: 799,
        description: 'Cute star-shaped stud earrings',
        sales: 20,
        image: null
    }
];

// Live tracking variables
let liveTrackingInterval;
let isLiveTrackingActive = false;

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    setupNavigation();
    setupModals();
    loadDashboard();
});

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
    // Update stats
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-customers').textContent = customers.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    
    document.getElementById('total-products').textContent = products.length;
    
    // Load recent orders
    loadRecentOrders();
    
    // Add live tracking controls if not already present
    if (!document.querySelector('.live-controls')) {
        addLiveTrackingControls();
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
    
    tbody.innerHTML = customers.map(customer => {
        const customerOrders = orders.filter(order => order.customerEmail === customer.email);
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.amount, 0);
        
        return `
            <tr>
                <td>#${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customerOrders.length}</td>
                <td>₹${totalSpent.toLocaleString()}</td>
                <td>${new Date(customer.joinDate).toLocaleDateString()}</td>
            </tr>
        `;
    }).join('');
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
    
    content.innerHTML = `
        <div class="order-detail">
            <h4>Order #${order.id}</h4>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Product:</strong> ${order.productName}</p>
            <p><strong>Amount:</strong> ₹${order.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[currentIndex + 1] || statuses[0];
    
    order.status = nextStatus;
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
    
    loadOrders();
    loadDashboard();
    
    // Show notification
    showNotification(`Order #${orderId} status updated to ${nextStatus}`);
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

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4af37;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
`;
document.head.appendChild(style);

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
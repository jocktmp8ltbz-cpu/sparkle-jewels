// Sparkle Jewels - Professional E-commerce Website
// Product data
const products = JSON.parse(localStorage.getItem('jewelryProducts')) || [
    {
        id: 1,
        name: 'Golden Pearl Necklace',
        category: 'necklaces',
        price: 2999,
        description: 'Beautiful golden pearl necklace for special occasions',
        image: null
    },
    {
        id: 2,
        name: 'Diamond Drop Earrings',
        category: 'earrings',
        price: 1599,
        description: 'Elegant diamond drop earrings',
        image: null
    },
    {
        id: 3,
        name: 'Silver Chain Bracelet',
        category: 'bracelets',
        price: 899,
        description: 'Stylish silver chain bracelet',
        image: null
    },
    {
        id: 4,
        name: 'Royal Ruby Ring',
        category: 'rings',
        price: 1299,
        description: 'Stunning royal ruby ring',
        image: null
    },
    {
        id: 5,
        name: 'Heart Pendant Set',
        category: 'necklaces',
        price: 2199,
        description: 'Romantic heart pendant necklace set',
        image: null
    },
    {
        id: 6,
        name: 'Star Stud Earrings',
        category: 'earrings',
        price: 799,
        description: 'Cute star-shaped stud earrings',
        image: null
    }
];

let currentOrderId = null;
let liveTrackingInterval;
let cart = JSON.parse(localStorage.getItem('jewelryCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('jewelryWishlist')) || [];

// Professional cart management
function addToCart(productId, quantity = 1) {
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    const product = currentProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('jewelryCart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('jewelryCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('jewelryCart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart icon with count
    if (cartCount > 0) {
        cartIcon.style.position = 'relative';
        
        // Remove existing badge
        const existingBadge = cartIcon.parentNode.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add new badge
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = cartCount;
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        cartIcon.parentNode.appendChild(badge);
        cartIcon.style.color = '#d4af37';
    } else {
        const badge = cartIcon.parentNode.querySelector('.cart-badge');
        if (badge) {
            badge.remove();
        }
        cartIcon.style.color = '#333';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#27ae60' : 
                    type === 'error' ? '#e74c3c' : 
                    type === 'warning' ? '#f39c12' : '#3498db';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Live tracking for customers
function startCustomerLiveTracking(orderId) {
    if (liveTrackingInterval) {
        clearInterval(liveTrackingInterval);
    }
    
    // Check for order updates every 10 seconds
    liveTrackingInterval = setInterval(() => {
        const orders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
        const order = orders.find(o => 
            o.id.toString() === orderId || 
            o.trackingId === orderId
        );
        
        if (order && order.lastUpdated) {
            // Show notification if order status changed recently
            const lastUpdate = new Date(order.lastUpdated);
            const now = new Date();
            const timeDiff = now - lastUpdate;
            
            // If updated within last 30 seconds, show notification
            if (timeDiff < 30000) {
                showLiveUpdateNotification(order);
            }
        }
    }, 10000);
}

function showLiveUpdateNotification(order) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-bell"></i>
            <div>
                <strong>Order Update!</strong><br>
                <small>Order #${order.id} is now ${order.status}</small>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Buy Now functionality
function buyNow(productId) {
    // Get current products from localStorage
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    const product = currentProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    currentOrderId = productId;
    
    // Populate order details
    document.getElementById('order-details').innerHTML = `
        <div class="order-item">
            <div class="item-details">
                <h5>${product.name}</h5>
                <p>${product.description}</p>
            </div>
            <div class="item-price">₹${product.price.toLocaleString()}</div>
        </div>
    `;
    
    document.getElementById('total-amount').textContent = `₹${product.price.toLocaleString()}`;
    
    // Show checkout modal
    document.getElementById('checkout-modal').style.display = 'block';
}

// Checkout form handling
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let orderItems = [];
    let totalAmount = 0;
    
    // Check if it's a single product order or cart order
    if (cart.length > 0) {
        // Cart order
        orderItems = cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));
        totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } else {
        // Single product order
        const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
        const product = currentProducts.find(p => p.id === currentOrderId);
        
        if (!product) return;
        
        orderItems = [{
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        }];
        totalAmount = product.price;
    }
    
    // Get form data
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Use database system for order creation
    try {
        // Initialize database if not already done
        if (typeof sparkleDB === 'undefined') {
            // Create a simple database interface for customer site
            window.sparkleDB = {
                addCustomer: function(customerData) {
                    let customers = JSON.parse(localStorage.getItem('db_customers')) || [];
                    const newCustomer = {
                        id: 'CUST' + Date.now() + Math.floor(Math.random() * 1000),
                        name: customerData.name,
                        email: customerData.email,
                        phone: customerData.phone,
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
                },
                
                getCustomerByEmail: function(email) {
                    const customers = JSON.parse(localStorage.getItem('db_customers')) || [];
                    return customers.find(customer => customer.email === email);
                },
                
                addOrder: function(orderData) {
                    let orders = JSON.parse(localStorage.getItem('db_orders')) || [];
                    const orderId = Date.now();
                    const trackingId = 'TRK' + orderId.toString().slice(-6);
                    
                    const newOrder = {
                        id: 'ORD' + Date.now() + Math.floor(Math.random() * 1000),
                        orderId: orderId,
                        trackingId: trackingId,
                        customerId: orderData.customerId,
                        customerName: orderData.customerName,
                        customerEmail: orderData.customerEmail,
                        customerPhone: orderData.customerPhone,
                        shippingAddress: {
                            street: orderData.address,
                            city: '',
                            state: '',
                            pincode: '',
                            country: 'India'
                        },
                        items: orderData.items || [],
                        subtotal: orderData.amount,
                        tax: 0,
                        shippingCharges: 0,
                        discount: 0,
                        totalAmount: orderData.amount,
                        paymentMethod: orderData.paymentMethod,
                        paymentStatus: 'pending',
                        orderStatus: 'pending',
                        orderType: orderData.orderType || 'single',
                        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
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
                },
                
                updateCustomerStats: function(customerIdentifier, order) {
                    let customers = JSON.parse(localStorage.getItem('db_customers')) || [];
                    let customer;
                    
                    if (customerIdentifier.includes('@')) {
                        customer = customers.find(c => c.email === customerIdentifier);
                    } else {
                        customer = customers.find(c => c.id === customerIdentifier);
                    }
                    
                    if (customer) {
                        customer.totalOrders += 1;
                        customer.totalSpent += order.totalAmount;
                        customer.lastOrderDate = order.createdAt;
                        customer.updatedAt = new Date().toISOString();
                        localStorage.setItem('db_customers', JSON.stringify(customers));
                    }
                }
            };
        }
        
        // Check if customer exists, if not create new customer
        let customer = sparkleDB.getCustomerByEmail(customerEmail);
        if (!customer) {
            customer = sparkleDB.addCustomer({
                name: customerName,
                email: customerEmail,
                phone: customerPhone
            });
        }
        
        // Create order using database system
        const orderData = {
            customerId: customer.id,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            address: customerAddress,
            items: orderItems,
            amount: totalAmount,
            paymentMethod: paymentMethod,
            orderType: cart.length > 0 ? 'cart' : 'single'
        };
        
        const newOrder = sparkleDB.addOrder(orderData);
        
        // Create order object for backward compatibility
        const order = {
            id: newOrder.orderId,
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            customerPhone: newOrder.customerPhone,
            address: customerAddress,
            items: orderItems,
            productName: orderItems.length === 1 ? orderItems[0].name : `${orderItems.length} items`,
            amount: totalAmount,
            status: 'pending',
            date: newOrder.createdAt,
            trackingId: newOrder.trackingId,
            paymentMethod: paymentMethod,
            orderType: cart.length > 0 ? 'cart' : 'single'
        };
        
        // Also save to old format for backward compatibility
        let oldOrders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
        oldOrders.push(order);
        localStorage.setItem('jewelryOrders', JSON.stringify(oldOrders));
        
        // Save customer to old format for backward compatibility
        let oldCustomers = JSON.parse(localStorage.getItem('jewelryCustomers')) || [];
        const existingOldCustomer = oldCustomers.find(c => c.email === customerEmail);
        
        if (!existingOldCustomer) {
            const oldCustomer = {
                id: oldCustomers.length + 1,
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                joinDate: new Date().toISOString()
            };
            oldCustomers.push(oldCustomer);
            localStorage.setItem('jewelryCustomers', JSON.stringify(oldCustomers));
        }
        
        // Clear cart if it was a cart order
        if (cart.length > 0) {
            cart = [];
            localStorage.setItem('jewelryCart', JSON.stringify(cart));
            updateCartUI();
        }
        
        // Close checkout modal
        document.getElementById('checkout-modal').style.display = 'none';
        
        // Show success modal
        showOrderSuccess(order);
        
        // Send order confirmation
        sendOrderConfirmation(order);
        
    } catch (error) {
        console.error('Error creating order:', error);
        showNotification('Error placing order. Please try again.', 'error');
    }
});

function showOrderSuccess(order) {
    document.getElementById('order-success-details').innerHTML = `
        <div class="order-success-info">
            <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #27ae60;">
                <h4 style="color: #27ae60; margin-bottom: 1rem;"><i class="fas fa-check-circle"></i> Order Confirmed!</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <p><strong>Order ID:</strong></p>
                        <p style="font-size: 1.2rem; color: #2c3e50; font-weight: bold; background: white; padding: 8px; border-radius: 5px; border: 2px dashed #27ae60;">#${order.id}</p>
                    </div>
                    <div>
                        <p><strong>Tracking ID:</strong></p>
                        <p style="font-size: 1.2rem; color: #2c3e50; font-weight: bold; background: white; padding: 8px; border-radius: 5px; border: 2px dashed #27ae60;">${order.trackingId}</p>
                    </div>
                </div>
                <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; border-left: 4px solid #f39c12; margin-top: 1rem;">
                    <p style="color: #856404; margin: 0;"><i class="fas fa-info-circle"></i> <strong>Important:</strong> Save these numbers to track your order!</p>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h5 style="color: #2c3e50; margin-bottom: 1rem;">Order Details:</h5>
                <p><strong>Product:</strong> ${order.productName}</p>
                <p><strong>Amount:</strong> ₹${order.amount.toLocaleString()}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>Status:</strong> <span style="color: #f39c12; font-weight: bold;">Order Confirmed & Processing</span></p>
                <p><strong>Estimated Delivery:</strong> 3-5 Business Days</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #2196f3;">
                <h5 style="color: #1976d2; margin-bottom: 1rem;"><i class="fas fa-envelope"></i> Order Confirmation Sent</h5>
                <p style="color: #1565c0; margin: 0;">A confirmation message has been sent to <strong>${order.customerEmail}</strong></p>
                <p style="color: #1565c0; margin: 5px 0 0 0; font-size: 0.9rem;">Please check your email and SMS for order details.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 1.5rem; padding: 1rem; background: #f0f8ff; border-radius: 10px;">
            <p style="color: #2c3e50; margin-bottom: 1rem;"><strong>What happens next?</strong></p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: center;">
                <div>
                    <i class="fas fa-cog" style="color: #f39c12; font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.9rem; color: #666;">Order Processing<br><small>Within 24 hours</small></p>
                </div>
                <div>
                    <i class="fas fa-truck" style="color: #3498db; font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.9rem; color: #666;">Shipped<br><small>1-2 business days</small></p>
                </div>
                <div>
                    <i class="fas fa-home" style="color: #27ae60; font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.9rem; color: #666;">Delivered<br><small>3-5 business days</small></p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('order-success-modal').style.display = 'block';
    
    // Simulate sending confirmation email/SMS
    setTimeout(() => {
        sendOrderConfirmation(order);
    }, 1000);
    
    // Auto-copy order details to clipboard
    copyOrderDetailsToClipboard(order);
}

// Order tracking functionality
function showTrackingModal() {
    document.getElementById('order-tracking-modal').style.display = 'block';
    // Clear previous results when opening modal
    document.getElementById('tracking-result').innerHTML = '';
    document.getElementById('tracking-input').value = '';
}

function trackOrder() {
    const trackingInput = document.getElementById('tracking-input').value.trim();
    if (!trackingInput) {
        // Show a user-friendly message instead of alert
        document.getElementById('tracking-result').innerHTML = `
            <div class="tracking-result">
                <p style="color: #f39c12; text-align: center; padding: 2rem;">
                    <i class="fas fa-info-circle"></i>
                    Please enter an Order ID or Tracking Number to track your order.
                </p>
            </div>
        `;
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
    const order = orders.find(o => 
        o.id.toString() === trackingInput || 
        o.trackingId === trackingInput ||
        trackingInput === o.id.toString()
    );
    
    if (!order) {
        document.getElementById('tracking-result').innerHTML = `
            <div class="tracking-result">
                <p style="color: #e74c3c; text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Order not found. Please check your Order ID or Tracking Number.
                </p>
                <div style="text-align: center; margin-top: 1rem;">
                    <button onclick="clearTracking()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    // Start live tracking for this order
    startCustomerLiveTracking(trackingInput);
    
    // Generate tracking steps based on order status
    const trackingSteps = generateTrackingSteps(order);
    
    document.getElementById('tracking-result').innerHTML = `
        <div class="tracking-result">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h4>Order #${order.id}</h4>
                <p><strong>Product:</strong> ${order.productName}</p>
                <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
                <div class="live-indicator" style="justify-content: center; margin-top: 10px;">
                    <div class="live-dot"></div>
                    <span>Live tracking active</span>
                </div>
            </div>
            <div class="tracking-steps">
                ${trackingSteps}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="clearTracking()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Track Another Order
                </button>
            </div>
        </div>
    `;
}

function generateTrackingSteps(order) {
    const steps = [
        { name: 'Order Placed', icon: 'fas fa-shopping-cart', description: 'Your order has been confirmed' },
        { name: 'Processing', icon: 'fas fa-cog', description: 'We are preparing your order' },
        { name: 'Shipped', icon: 'fas fa-truck', description: 'Your order is on the way' },
        { name: 'Delivered', icon: 'fas fa-check-circle', description: 'Order delivered successfully' }
    ];
    
    const statusIndex = {
        'pending': 0,
        'processing': 1,
        'shipped': 2,
        'delivered': 3
    };
    
    const currentStep = statusIndex[order.status] || 0;
    
    return steps.map((step, index) => {
        let stepClass = '';
        if (index < currentStep) stepClass = 'completed';
        else if (index === currentStep) stepClass = 'current';
        
        return `
            <div class="tracking-step ${stepClass}">
                <div class="step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <div class="step-info">
                    <h5>${step.name}</h5>
                    <p>${step.description}</p>
                    ${index === currentStep ? `<small style="color: #d4af37;">Current Status</small>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Modal management
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
    document.getElementById('checkout-form').reset();
}

function closeSuccessModal() {
    document.getElementById('order-success-modal').style.display = 'none';
}

function closeTrackingModal() {
    document.getElementById('order-tracking-modal').style.display = 'none';
    // Clear tracking results and input
    document.getElementById('tracking-result').innerHTML = '';
    document.getElementById('tracking-input').value = '';
    // Stop live tracking when modal closes
    if (liveTrackingInterval) {
        clearInterval(liveTrackingInterval);
    }
}

function clearTracking() {
    document.getElementById('tracking-input').value = '';
    document.getElementById('tracking-result').innerHTML = '';
    // Stop live tracking if active
    if (liveTrackingInterval) {
        clearInterval(liveTrackingInterval);
    }
}

function quickView(productId) {
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    const product = currentProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    // Create quick view modal
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'modal';
    quickViewModal.id = 'quick-view-modal';
    quickViewModal.style.display = 'block';
    
    quickViewModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeQuickView()">&times;</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div class="quick-view-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">` :
                        `<div class="jewelry-placeholder ${product.category.slice(0, -1)}" style="height: 250px;">
                            <i class="fas fa-circle"></i>
                        </div>`
                    }
                </div>
                <div class="quick-view-details">
                    <h2 style="color: #2c3e50; margin-bottom: 1rem;">${product.name}</h2>
                    <p style="color: #7f8c8d; margin-bottom: 1rem;">${product.description}</p>
                    <p style="font-size: 1.5rem; color: #d4af37; font-weight: bold; margin-bottom: 2rem;">₹${product.price.toLocaleString()}</p>
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="addToCart(${product.id}); closeQuickView();" style="background: #3498db; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; flex: 1;">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button onclick="buyNow(${product.id}); closeQuickView();" style="background: linear-gradient(45deg, #d4af37, #f1c40f); color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; flex: 1;">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(quickViewModal);
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.remove();
    }
}

// Order confirmation system
function sendOrderConfirmation(order) {
    // Simulate email/SMS confirmation
    showNotification('Order confirmation sent to your email and phone!', 'success');
    
    // Store order confirmation for later retrieval
    let confirmations = JSON.parse(localStorage.getItem('orderConfirmations')) || [];
    const confirmation = {
        orderId: order.id,
        trackingId: order.trackingId,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        sentAt: new Date().toISOString(),
        message: `Dear ${order.customerName}, your order #${order.id} has been confirmed. Track with ID: ${order.trackingId}. Estimated delivery: 3-5 days. Thank you for choosing Sparkle Jewels!`
    };
    
    confirmations.push(confirmation);
    localStorage.setItem('orderConfirmations', JSON.stringify(confirmations));
    
    // Show confirmation notification
    setTimeout(() => {
        showDetailedConfirmation(order);
    }, 2000);
}

function showDetailedConfirmation(order) {
    const confirmationNotification = document.createElement('div');
    confirmationNotification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 400px;
        width: 90%;
        text-align: center;
        border: 3px solid #27ae60;
    `;
    
    confirmationNotification.innerHTML = `
        <div style="color: #27ae60; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">Confirmation Sent!</h3>
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
            <p style="color: #27ae60; margin: 0; font-weight: bold;">📧 Email sent to:</p>
            <p style="color: #2c3e50; margin: 5px 0;">${order.customerEmail}</p>
            <p style="color: #27ae60; margin: 10px 0 0 0; font-weight: bold;">📱 SMS sent to:</p>
            <p style="color: #2c3e50; margin: 5px 0;">${order.customerPhone}</p>
        </div>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">
            Your order details have been sent to your email and phone number.
        </p>
        <button onclick="this.parentElement.remove()" 
                style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer;">
            Got it!
        </button>
    `;
    
    document.body.appendChild(confirmationNotification);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (confirmationNotification.parentNode) {
            confirmationNotification.remove();
        }
    }, 8000);
}

function copyOrderDetailsToClipboard(order) {
    const orderDetails = `
🛍️ SPARKLE JEWELS - ORDER CONFIRMATION

📋 Order ID: #${order.id}
🔍 Tracking ID: ${order.trackingId}
💎 Product: ${order.productName}
💰 Amount: ₹${order.amount.toLocaleString()}
💳 Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
📅 Order Date: ${new Date(order.date).toLocaleDateString()}
🚚 Estimated Delivery: 3-5 Business Days

📞 Customer Support: +91 98765 43210
🌐 Track Online: Use Order ID or Tracking ID

Thank you for choosing Sparkle Jewels! ✨
    `.trim();
    
    // Try to copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(orderDetails).then(() => {
            setTimeout(() => {
                showNotification('Order details copied to clipboard!', 'info');
            }, 3000);
        }).catch(() => {
            // Fallback - show order details in a modal
            showOrderDetailsModal(orderDetails);
        });
    } else {
        // Fallback for older browsers
        showOrderDetailsModal(orderDetails);
    }
}

function showOrderDetailsModal(orderDetails) {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'modal';
    detailsModal.style.display = 'block';
    
    detailsModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3><i class="fas fa-copy"></i> Order Details</h3>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 0.9rem; color: #2c3e50; margin: 0;">${orderDetails}</pre>
            </div>
            <div style="text-align: center;">
                <button onclick="copyTextToClipboard('${orderDetails.replace(/'/g, "\\'")}'); this.closest('.modal').remove();" 
                        style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-copy"></i> Copy Details
                </button>
                <button onclick="this.closest('.modal').remove()" 
                        style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailsModal);
}

function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Order details copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Order details copied!', 'success');
        } catch (err) {
            showNotification('Please manually copy the order details', 'warning');
        }
        document.body.removeChild(textArea);
    }
}

// Add order retrieval system
function showOrderRetrievalSystem() {
    const retrievalModal = document.createElement('div');
    retrievalModal.className = 'modal';
    retrievalModal.style.display = 'block';
    
    retrievalModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3><i class="fas fa-search"></i> Find Your Order</h3>
            <p style="color: #666; margin-bottom: 2rem;">Enter your email or phone number to retrieve your order details</p>
            
            <div style="margin-bottom: 1rem;">
                <input type="text" id="retrieval-input" placeholder="Enter email or phone number" 
                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
            </div>
            
            <div style="text-align: center;">
                <button onclick="retrieveOrderDetails()" 
                        style="background: #d4af37; color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-search"></i> Find Orders
                </button>
                <button onclick="this.closest('.modal').remove()" 
                        style="background: #95a5a6; color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer;">
                    Cancel
                </button>
            </div>
            
            <div id="retrieval-results" style="margin-top: 2rem;"></div>
        </div>
    `;
    
    document.body.appendChild(retrievalModal);
}

function retrieveOrderDetails() {
    const input = document.getElementById('retrieval-input').value.trim();
    if (!input) {
        showNotification('Please enter your email or phone number', 'warning');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
    const userOrders = orders.filter(order => 
        order.customerEmail.toLowerCase().includes(input.toLowerCase()) ||
        order.customerPhone.includes(input)
    );
    
    const resultsDiv = document.getElementById('retrieval-results');
    
    if (userOrders.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #fff3cd; border-radius: 10px; border-left: 4px solid #f39c12;">
                <i class="fas fa-exclamation-triangle" style="color: #f39c12; font-size: 2rem; margin-bottom: 1rem;"></i>
                <p style="color: #856404; margin: 0;">No orders found for this email or phone number.</p>
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = `
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 10px; border-left: 4px solid #27ae60; margin-bottom: 1rem;">
            <h4 style="color: #27ae60; margin-bottom: 1rem;"><i class="fas fa-check-circle"></i> Found ${userOrders.length} order(s)</h4>
        </div>
        ${userOrders.map(order => `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #d4af37;">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: #2c3e50;">Order #${order.id}</strong>
                    <span style="background: #d4af37; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">${order.status}</span>
                </div>
                <p style="margin: 5px 0; color: #666;"><strong>Tracking ID:</strong> ${order.trackingId}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Product:</strong> ${order.productName}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ₹${order.amount.toLocaleString()}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                <div style="margin-top: 1rem;">
                    <button onclick="trackSpecificOrder('${order.trackingId}')" 
                            style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">
                        <i class="fas fa-map-marker-alt"></i> Track Order
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

function trackSpecificOrder(trackingId) {
    // Close retrieval modal
    document.querySelector('#retrieval-input').closest('.modal').remove();
    
    // Open tracking modal and auto-fill tracking ID
    showTrackingModal();
    document.getElementById('tracking-input').value = trackingId;
    trackOrder();
}

function trackNewOrder() {
    closeSuccessModal();
    showTrackingModal();
}

// Setup modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            
            // Handle specific modal close actions
            if (modal.id === 'order-tracking-modal') {
                closeTrackingModal();
            } else if (modal.id === 'checkout-modal') {
                closeCheckoutModal();
            } else if (modal.id === 'order-success-modal') {
                closeSuccessModal();
            } else {
                modal.style.display = 'none';
            }
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                // Handle specific modal close actions
                if (modal.id === 'order-tracking-modal') {
                    closeTrackingModal();
                } else if (modal.id === 'checkout-modal') {
                    closeCheckoutModal();
                } else if (modal.id === 'order-success-modal') {
                    closeSuccessModal();
                } else {
                    modal.style.display = 'none';
                }
            }
        });
    });
    
    // Handle Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    if (modal.id === 'order-tracking-modal') {
                        closeTrackingModal();
                    } else if (modal.id === 'checkout-modal') {
                        closeCheckoutModal();
                    } else if (modal.id === 'order-success-modal') {
                        closeSuccessModal();
                    } else {
                        modal.style.display = 'none';
                    }
                }
            });
        }
    });
    
    // Load dynamic gallery
    loadDynamicGallery();
    
    // Initialize cart UI
    updateCartUI();
    
    // Initialize professional features
    initializeProfessionalFeatures();
});

// Existing code continues...
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Auto-play slider
setInterval(nextSlide, 5000);

// Slider navigation
document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Gallery filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
    this.reset();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// CTA button click handlers
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.textContent.includes('Shop') || this.textContent.includes('Explore')) {
            document.querySelector('#gallery').scrollIntoView({
                behavior: 'smooth'
            });
        } else if (this.textContent.includes('Bridal')) {
            document.querySelector('#collections').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Collection button handlers
document.querySelectorAll('.collection-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('#gallery').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Filter gallery based on collection
        const collectionType = this.closest('.collection-card').querySelector('h3').textContent;
        setTimeout(() => {
            if (collectionType.includes('Bridal')) {
                document.querySelector('[data-filter="necklaces"]').click();
            } else if (collectionType.includes('Party')) {
                document.querySelector('[data-filter="earrings"]').click();
            } else {
                document.querySelector('[data-filter="all"]').click();
            }
        }, 500);
    });
});

// Add animation on scroll for gallery items
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items and collection cards for animation
document.querySelectorAll('.gallery-item, .collection-card').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Shopping cart functionality (basic)
let cartCount = 0;
const cartIcon = document.querySelector('.fa-shopping-cart');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const itemName = this.querySelector('h3').textContent;
        const itemPrice = this.querySelector('.price').textContent;
        
        // Simple cart simulation
        cartCount++;
        cartIcon.style.color = '#d4af37';
        cartIcon.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
        
        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #d4af37;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = `${itemName} added to cart!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
});

// Search functionality (basic)
const searchIcon = document.querySelector('.fa-search');
searchIcon.addEventListener('click', function() {
    const searchTerm = prompt('Search for jewelry:');
    if (searchTerm) {
        // Simple search simulation
        const items = document.querySelectorAll('.gallery-item h3');
        let found = false;
        
        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.closest('.gallery-item').style.border = '3px solid #d4af37';
                found = true;
                
                // Scroll to gallery
                document.querySelector('#gallery').scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                item.closest('.gallery-item').style.border = 'none';
            }
        });
        
        if (!found) {
            alert('No items found matching your search.');
        }
    }
});

// Add CSS for slide-in animation
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

// Professional features initialization
function initializeProfessionalFeatures() {
    // Add search functionality
    setupSearchFeature();
    
    // Add cart click handler
    setupCartHandler();
    
    // Add wishlist functionality
    setupWishlistFeature();
    
    // Add professional animations
    setupScrollAnimations();
}

// Search functionality
function setupSearchFeature() {
    const searchIcon = document.querySelector('.fa-search');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            showSearchModal();
        });
    }
}

function showSearchModal() {
    const searchModal = document.createElement('div');
    searchModal.className = 'modal';
    searchModal.id = 'search-modal';
    searchModal.style.display = 'block';
    
    searchModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeSearchModal()">&times;</span>
            <h3><i class="fas fa-search"></i> Search Products</h3>
            <div style="margin: 2rem 0;">
                <input type="text" id="search-input" placeholder="Search for jewelry..." 
                       style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;"
                       onkeyup="performSearch(this.value)">
            </div>
            <div id="search-results" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
    `;
    
    document.body.appendChild(searchModal);
    document.getElementById('search-input').focus();
}

function performSearch(query) {
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    const results = currentProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const resultsContainer = document.getElementById('search-results');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Type at least 2 characters to search...</p>';
        return;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #e74c3c;">No products found matching your search.</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(product => `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e0e0e0; cursor: pointer;"
             onclick="selectSearchResult(${product.id})">
            <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden;">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<div class="jewelry-placeholder ${product.category.slice(0, -1)}" style="width: 100%; height: 100%; font-size: 1.5rem;">
                        <i class="fas fa-circle"></i>
                    </div>`
                }
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0; color: #2c3e50;">${product.name}</h4>
                <p style="margin: 5px 0; color: #7f8c8d; font-size: 0.9rem;">${product.description}</p>
                <p style="margin: 0; color: #d4af37; font-weight: bold;">₹${product.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function selectSearchResult(productId) {
    closeSearchModal();
    // Scroll to gallery and highlight the product
    document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (productElement) {
            productElement.style.border = '3px solid #d4af37';
            productElement.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                productElement.style.border = 'none';
                productElement.style.transform = 'scale(1)';
            }, 3000);
        }
    }, 1000);
}

function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.remove();
    }
}

// Cart handler
function setupCartHandler() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCartModal();
        });
    }
}

function showCartModal() {
    const cartModal = document.createElement('div');
    cartModal.className = 'modal';
    cartModal.id = 'cart-modal';
    cartModal.style.display = 'block';
    
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    cartModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeCartModal()">&times;</span>
            <h3><i class="fas fa-shopping-cart"></i> Shopping Cart (${cart.length} items)</h3>
            <div id="cart-items" style="max-height: 400px; overflow-y: auto; margin: 2rem 0;">
                ${cart.length === 0 ? 
                    '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">Your cart is empty</p>' :
                    cart.map(item => `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e0e0e0;">
                            <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden;">
                                ${item.image ? 
                                    `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div class="jewelry-placeholder" style="width: 100%; height: 100%; background: #d4af37; display: flex; align-items: center; justify-content: center; color: white;">
                                        <i class="fas fa-gem"></i>
                                    </div>`
                                }
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; color: #2c3e50;">${item.name}</h4>
                                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">₹${item.price.toLocaleString()}</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})" 
                                        style="background: #e74c3c; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                                <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                                <button onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})" 
                                        style="background: #27ae60; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
                                <button onclick="removeFromCart(${item.productId})" 
                                        style="background: #95a5a6; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            ${cart.length > 0 ? `
                <div style="border-top: 2px solid #e0e0e0; padding-top: 1rem;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="color: #2c3e50;">Total: ₹${cartTotal.toLocaleString()}</h3>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="clearCart()" style="background: #95a5a6; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; flex: 1;">
                            Clear Cart
                        </button>
                        <button onclick="proceedToCheckout()" style="background: linear-gradient(45deg, #d4af37, #f1c40f); color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; flex: 2;">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(cartModal);
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.remove();
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('jewelryCart', JSON.stringify(cart));
    updateCartUI();
    closeCartModal();
    showNotification('Cart cleared!', 'info');
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    
    closeCartModal();
    // Show checkout modal with cart items
    showCheckoutWithCart();
}

function showCheckoutWithCart() {
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Populate order details with cart items
    document.getElementById('order-details').innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-details">
                <h5>${item.name} (x${item.quantity})</h5>
                <p>₹${item.price.toLocaleString()} each</p>
            </div>
            <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    document.getElementById('total-amount').textContent = `₹${cartTotal.toLocaleString()}`;
    
    // Show checkout modal
    document.getElementById('checkout-modal').style.display = 'block';
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe gallery items and collection cards for animation
    document.querySelectorAll('.gallery-item, .collection-card, .stat-card').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Dynamic gallery loading
function loadDynamicGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Refresh products from localStorage
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    
    // Clear existing static items
    galleryGrid.innerHTML = '';
    
    // Load products from localStorage or use default
    currentProducts.forEach(product => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', product.category);
        galleryItem.setAttribute('data-product-id', product.id);
        
        galleryItem.innerHTML = `
            <div class="item-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover;">` :
                    `<div class="jewelry-placeholder ${product.category.slice(0, -1)}">
                        <i class="fas fa-circle"></i>
                    </div>`
                }
                <div class="item-overlay">
                    <button class="quick-view-btn" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
            <div class="item-info">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <div class="item-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
                </div>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Re-setup filter functionality
    setupGalleryFilters();
}

// Listen for product updates from admin panel
window.addEventListener('productsUpdated', function() {
    loadDynamicGallery();
});

// Also listen for storage changes (when admin updates products)
window.addEventListener('storage', function(e) {
    if (e.key === 'jewelryProducts') {
        loadDynamicGallery();
    }
});

function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'slideInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
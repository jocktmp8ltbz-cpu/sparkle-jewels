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
    
    // Get current products from localStorage
    const currentProducts = JSON.parse(localStorage.getItem('jewelryProducts')) || products;
    const product = currentProducts.find(p => p.id === currentOrderId);
    
    if (!product) return;
    
    // Get form data
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Generate order
    const orderId = Date.now();
    const trackingId = 'TRK' + orderId.toString().slice(-6);
    
    const order = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        address: customerAddress,
        productName: product.name,
        amount: product.price,
        status: 'pending',
        date: new Date().toISOString(),
        trackingId,
        paymentMethod
    };
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('jewelryOrders')) || [];
    orders.push(order);
    localStorage.setItem('jewelryOrders', JSON.stringify(orders));
    
    // Save customer if new
    let customers = JSON.parse(localStorage.getItem('jewelryCustomers')) || [];
    const existingCustomer = customers.find(c => c.email === customerEmail);
    
    if (!existingCustomer) {
        const customer = {
            id: customers.length + 1,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            joinDate: new Date().toISOString()
        };
        customers.push(customer);
        localStorage.setItem('jewelryCustomers', JSON.stringify(customers));
    }
    
    // Close checkout modal
    document.getElementById('checkout-modal').style.display = 'none';
    
    // Show success modal
    showOrderSuccess(order);
});

function showOrderSuccess(order) {
    document.getElementById('order-success-details').innerHTML = `
        <div class="order-success-info">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
            <p><strong>Product:</strong> ${order.productName}</p>
            <p><strong>Amount:</strong> ₹${order.amount.toLocaleString()}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p><strong>Status:</strong> Order Confirmed</p>
        </div>
        <p>You will receive a confirmation email shortly. Your order will be processed within 24 hours.</p>
    `;
    
    document.getElementById('order-success-modal').style.display = 'block';
}

// Order tracking functionality
function showTrackingModal() {
    document.getElementById('order-tracking-modal').style.display = 'block';
}

function trackOrder() {
    const trackingInput = document.getElementById('tracking-input').value.trim();
    if (!trackingInput) {
        alert('Please enter an Order ID or Tracking Number');
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
                <p style="color: #e74c3c; text-align: center;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Order not found. Please check your Order ID or Tracking Number.
                </p>
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
            this.closest('.modal').style.display = 'none';
            // Stop live tracking when modal closes
            if (liveTrackingInterval) {
                clearInterval(liveTrackingInterval);
            }
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                // Stop live tracking when modal closes
                if (liveTrackingInterval) {
                    clearInterval(liveTrackingInterval);
                }
            }
        });
    });
    
    // Load dynamic gallery
    loadDynamicGallery();
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
            </div>
            <div class="item-info">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
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
// Main JavaScript file for NexTEA Website

// ========== DATABASE SYSTEM (LocalStorage) ==========
// Tea prices database
const TEA_PRICES = {
    'Green Tea': 100,
    'Masala Tea': 120,
    'Lemon Tea': 110
};

// Initialize database (cart and orders)
function initDatabase() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

// Cart Database Functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(teaName, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.tea === teaName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            tea: teaName,
            quantity: quantity,
            price: TEA_PRICES[teaName] || 100
        });
    }
    
    saveCart(cart);
    return cart;
}

function removeFromCart(teaName) {
    const cart = getCart();
    const newCart = cart.filter(item => item.tea !== teaName);
    saveCart(newCart);
    return newCart;
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Orders Database Functions
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveOrder(order) {
    const orders = getOrders();
    order.id = Date.now(); // Unique ID
    order.date = new Date().toLocaleString();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

// CSV Export Functions (Excel-compatible)
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (value && value.toString().includes(',')) {
                return `"${value.toString().replace(/"/g, '""')}"`;
            }
            return value || '';
        });
        csv += values.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportOrdersToCSV() {
    const orders = getOrders();
    if (orders.length === 0) {
        alert('No orders to export!');
        return;
    }
    exportToCSV(orders, `orders_${new Date().getTime()}.csv`);
}

function exportCartToCSV() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    // Add total row
    const cartWithTotal = cart.map(item => ({
        Tea: item.tea,
        Quantity: item.quantity,
        'Unit Price': item.price,
        'Total Price': item.price * item.quantity
    }));
    
    exportToCSV(cartWithTotal, `cart_${new Date().getTime()}.csv`);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    initDatabase();
    
    // ========== RESPONSIVE NAVBAR ==========
    initResponsiveNavbar();
    
    // ========== SMOOTH SCROLLING ==========
    initSmoothScrolling();
    
    // ========== ANIMATIONS ON SCROLL ==========
    initScrollAnimations();
    
    // ========== FORM VALIDATION ==========
    initFormValidation();
    
    // ========== INTERACTIVE CARDS ==========
    initTeaCards();
    
    // ========== CART FUNCTIONALITY ==========
    initCart();
    
    // ========== LOGIN FUNCTIONALITY ==========
    initLogin();
    
    // ========== CART PAGE ==========
    loadCartPage();
    
    // ========== EXPORT ORDERS BUTTON ==========
    const exportOrdersBtn = document.getElementById('export-orders-btn');
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', function() {
            exportOrdersToCSV();
            showNotification('Orders exported to Excel!', 'success');
        });
    }
});

// ========== RESPONSIVE NAVBAR ==========
function initResponsiveNavbar() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Create hamburger menu button for mobile
    const navbar = document.querySelector('.navbar');
    if (navbar && !document.querySelector('.hamburger')) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = 'display: none; color: white; font-size: 24px; cursor: pointer;';
        navbar.appendChild(hamburger);
        
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && !navbar.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) hamburger.innerHTML = '☰';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) hamburger.innerHTML = '☰';
        }
    });
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
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
    
    // Animate tea cards
    document.querySelectorAll('.tea-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Animate hero text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.animation = 'fadeInUp 1s ease-out';
    }
}

// ========== FORM VALIDATION ==========
function initFormValidation() {
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                    input.addEventListener('input', function() {
                        this.style.borderColor = '#ddd';
                    }, { once: true });
                }
            });
            
            if (isValid) {
                // Get form data
                const customerName = inputs[0].value.trim();
                const teaName = inputs[1].value.trim();
                const quantity = parseInt(inputs[2].value) || 1;
                const address = inputs[3].value.trim();
                
                // Add to cart
                addToCart(teaName, quantity);
                
                // Save order to database
                const order = {
                    customerName: customerName,
                    teaName: teaName,
                    quantity: quantity,
                    address: address,
                    price: (TEA_PRICES[teaName] || 100) * quantity,
                    status: 'Pending'
                };
                saveOrder(order);
                
                // Clear form
                orderForm.reset();
                
                // Show success message
                showNotification('Order placed successfully and added to cart!', 'success');
                
                // Redirect to cart after delay
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1500);
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        });
    }
}

// ========== INTERACTIVE TEA CARDS ==========
function initTeaCards() {
    document.querySelectorAll('.tea-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 0 10px gray';
        });
        
        // Add to cart functionality
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const teaName = card.querySelector('h3').textContent;
                
                // Add to cart
                addToCart(teaName, 1);
                showNotification(`${teaName} added to cart!`, 'success');
                
                // Optionally redirect to cart or stay on page
                // window.location.href = 'cart.html';
            });
        }
    });
}

// ========== CART FUNCTIONALITY ==========
function initCart() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            if (confirm('Confirm your order?')) {
                // Create order from cart
                const order = {
                    customerName: 'Guest',
                    items: cart,
                    total: getCartTotal(),
                    status: 'Confirmed'
                };
                saveOrder(order);
                
                // Clear cart
                clearCart();
                
                showNotification('Order confirmed! Thank you for your purchase.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
}

// ========== LOAD CART PAGE ==========
function loadCartPage() {
    // Check if we're on cart page
    if (!document.querySelector('.cart-table')) return;
    
    const cart = getCart();
    const table = document.querySelector('.cart-table');
    const tbody = table.querySelector('tbody') || table;
    
    // Clear existing rows (except header)
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr:first-child');
    table.innerHTML = '';
    if (headerRow) {
        table.appendChild(headerRow);
    }
    
    // Create table structure if needed
    if (!table.querySelector('thead')) {
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Tea</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Action</th>
            </tr>
        `;
        table.appendChild(thead);
    }
    
    const tbodyElement = document.createElement('tbody');
    
    if (cart.length === 0) {
        tbodyElement.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <p>Your cart is empty!</p>
                    <a href="index.html" style="color: #667eea; text-decoration: none;">Continue Shopping</a>
                </td>
            </tr>
        `;
    } else {
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.tea}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price * item.quantity}</td>
                <td>
                    <button class="remove-btn" data-tea="${item.tea}" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
                </td>
            `;
            tbodyElement.appendChild(row);
        });
        
        // Add total row
        const totalRow = document.createElement('tr');
        totalRow.style.fontWeight = 'bold';
        totalRow.innerHTML = `
            <td>Total</td>
            <td>${cart.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td>₹${getCartTotal()}</td>
            <td></td>
        `;
        tbodyElement.appendChild(totalRow);
    }
    
    table.appendChild(tbodyElement);
    
    // Add remove button event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const teaName = this.getAttribute('data-tea');
            removeFromCart(teaName);
            loadCartPage(); // Reload cart
            showNotification(`${teaName} removed from cart`, 'success');
        });
    });
    
    // Add export button if not exists
    if (!document.querySelector('.export-btn')) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-btn';
        exportBtn.textContent = 'Export Cart to Excel';
        exportBtn.style.cssText = 'display: block; margin: 20px auto; padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;';
        exportBtn.addEventListener('click', exportCartToCSV);
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.parentNode.insertBefore(exportBtn, checkoutBtn);
        }
    }
}

// ========== LOGIN FUNCTIONALITY ==========
function initLogin() {
    const loginForm = document.querySelector('.login-box');
    if (loginForm) {
        const loginBtn = loginForm.querySelector('button');
        const inputs = loginForm.querySelectorAll('input');
        
        if (loginBtn && inputs.length >= 2) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const username = inputs[0].value.trim();
                const password = inputs[1].value.trim();
                
                if (username && password) {
                    // Simple validation (can be enhanced)
                    showNotification('Login successful!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showNotification('Please enter username and password', 'error');
                }
            });
        }
    }
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== ADD CSS ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .tea-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    @media (max-width: 768px) {
        .hamburger {
            display: block !important;
        }
        
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #2c2c2c;
            flex-direction: column;
            padding: 20px 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .nav-menu.active {
            max-height: 500px;
        }
        
        .nav-menu li {
            margin: 10px 0;
            text-align: center;
        }
        
        .navbar {
            position: relative;
        }
    }
`;
document.head.appendChild(style);

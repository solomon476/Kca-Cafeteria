// Screen Elements
const loginScreen = document.getElementById('login-screen');
const studentMenu = document.getElementById('student-menu');
const kitchenDashboard = document.getElementById('kitchen-dashboard');
const paymentModal = document.getElementById('payment-modal');

// --- Auth Logic ---
document.getElementById('login-btn').addEventListener('click', () => {
    // Basic transition for prototype
    loginScreen.style.display = 'none';
    studentMenu.style.display = 'flex';
});

// --- Cart Logic ---
let cartTotal = 0;
let cartItemsCount = 0;

function addToCart(price) {
    cartTotal += price;
    cartItemsCount++;
    
    // Update UI
    document.getElementById('cart-total-amount').innerText = cartTotal;
    document.getElementById('cart-badge').innerText = cartItemsCount;
    
    // Simple visual feedback
    const badge = document.getElementById('cart-badge');
    badge.style.transform = 'scale(1.2)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
}

// --- Checkout Logic ---
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cartTotal === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Show modal
    paymentModal.style.display = 'flex';

    // Simulate processing delay, then go to Kitchen Dashboard
    setTimeout(() => {
        paymentModal.style.display = 'none';
        studentMenu.style.display = 'none';
        kitchenDashboard.style.display = 'flex';
        
        // Reset cart for next time
        cartTotal = 0;
        cartItemsCount = 0;
        document.getElementById('cart-total-amount').innerText = cartTotal;
        document.getElementById('cart-badge').innerText = cartItemsCount;
    }, 2000);
});

// --- Kitchen Dashboard Logic ---
document.getElementById('toggle-orders').addEventListener('click', (e) => {
    document.getElementById('live-orders-section').style.display = 'block';
    document.getElementById('inventory-section').style.display = 'none';
    
    document.getElementById('toggle-orders').classList.add('active');
    document.getElementById('toggle-inventory').classList.remove('active');
});

document.getElementById('toggle-inventory').addEventListener('click', (e) => {
    document.getElementById('live-orders-section').style.display = 'none';
    document.getElementById('inventory-section').style.display = 'block';
    
    document.getElementById('toggle-inventory').classList.add('active');
    document.getElementById('toggle-orders').classList.remove('active');
});

function toggleOrderStatus(btn) {
    if (btn.classList.contains('status-preparing')) {
        btn.classList.remove('status-preparing');
        btn.classList.add('status-ready');
        btn.innerText = 'Ready';
    } else {
        // Optional: toggle back if clicked by mistake
        btn.classList.remove('status-ready');
        btn.classList.add('status-preparing');
        btn.innerText = 'Preparing';
    }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    kitchenDashboard.style.display = 'none';
    loginScreen.style.display = 'flex';
});

// Category pills logic (visual only for prototype)
const pills = document.querySelectorAll('.pill');
pills.forEach(pill => {
    pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
    });
});

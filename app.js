// Screen Elements
const loginScreen = document.getElementById('login-screen');
const signupScreen = document.getElementById('signup-screen');
const studentMenu = document.getElementById('student-menu');
const kitchenDashboard = document.getElementById('kitchen-dashboard');
const receiptModal = document.getElementById('receipt-modal');
const mpesaModal = document.getElementById('mpesa-modal');
const mpesaAmount = document.getElementById('mpesa-amount');
const mpesaFormSection = document.getElementById('mpesa-form-section');
const mpesaProcessingSection = document.getElementById('mpesa-processing-section');

// --- Auth Logic ---

function updateGreeting(nameInput) {
    const greetingEl = document.getElementById('user-greeting-name');
    if (nameInput && nameInput.trim() !== '') {
        let name = nameInput.trim();
        if(name.includes('/')) name = 'Student'; // fallback if they type a real ID
        greetingEl.innerText = name.charAt(0).toUpperCase() + name.slice(1);
    } else {
        greetingEl.innerText = 'Student';
    }
}

document.getElementById('login-btn').addEventListener('click', () => {
    // Basic transition for prototype
    const studentIdInput = document.getElementById('student-id').value;
    updateGreeting(studentIdInput);
    loginScreen.style.display = 'none';
    studentMenu.style.display = 'flex';
});

document.getElementById('signup-link').addEventListener('click', (e) => {
    e.preventDefault();
    loginScreen.style.display = 'none';
    signupScreen.style.display = 'flex';
});

document.getElementById('back-to-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    signupScreen.style.display = 'none';
    loginScreen.style.display = 'flex';
});

document.getElementById('create-account-btn').addEventListener('click', () => {
    // Basic transition for prototype
    const signupName = document.getElementById('signup-name').value;
    updateGreeting(signupName);
    signupScreen.style.display = 'none';
    studentMenu.style.display = 'flex';
});

// --- Cart Logic ---
let cartTotal = 0;
let cartItemsCount = 0;
let cartItems = {};

function addToCart(name, price) {
    cartTotal += price;
    cartItemsCount++;
    
    if (cartItems[name]) {
        cartItems[name].count++;
    } else {
        cartItems[name] = { price: price, count: 1 };
    }

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

    // Set amount and show M-Pesa modal
    mpesaAmount.innerText = cartTotal;
    mpesaFormSection.style.display = 'block';
    mpesaProcessingSection.style.display = 'none';
    mpesaModal.style.display = 'flex';
});

document.getElementById('mpesa-cancel-btn').addEventListener('click', () => {
    mpesaModal.style.display = 'none';
});

document.getElementById('mpesa-pay-btn').addEventListener('click', () => {
    const phone = document.getElementById('mpesa-phone').value;
    if(!phone) {
        alert("Please enter your M-Pesa phone number");
        return;
    }

    // Show processing (simulating STK push)
    mpesaFormSection.style.display = 'none';
    mpesaProcessingSection.style.display = 'block';

    // Simulate STK Push delay (user entering PIN on phone)
    setTimeout(() => {
        mpesaModal.style.display = 'none';
        
        // Populate and show receipt modal
        const receiptList = document.getElementById('receipt-items-list');
        receiptList.innerHTML = '';
        for (let itemName in cartItems) {
            let item = cartItems[itemName];
            let li = document.createElement('li');
            li.innerHTML = `<span>${item.count}x ${itemName}</span> <span>KES ${item.price * item.count}</span>`;
            receiptList.appendChild(li);
        }
        document.getElementById('receipt-total-amount').innerText = cartTotal;
        
        receiptModal.style.display = 'flex';
    }, 4000); // 4 seconds simulated delay
});

document.getElementById('close-receipt-btn').addEventListener('click', () => {
    receiptModal.style.display = 'none';
    studentMenu.style.display = 'none';
    kitchenDashboard.style.display = 'flex';
    
    // Reset cart
    cartTotal = 0;
    cartItemsCount = 0;
    cartItems = {};
    document.getElementById('cart-total-amount').innerText = cartTotal;
    document.getElementById('cart-badge').innerText = cartItemsCount;
});

// --- Kitchen Dashboard Logic ---

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

// Category pills logic
const pills = document.querySelectorAll('.pill');
const foodCards = document.querySelectorAll('.food-card');

pills.forEach(pill => {
    pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const filter = pill.getAttribute('data-filter');
        foodCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

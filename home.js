let cart = [];
let total = 0;

// ============================================
// INTERACTIVE 3D GLOW EFFECTS
// ============================================

// Create glow cursor element
const glowCursor = document.createElement('div');
glowCursor.id = 'glowCursor';
document.body.appendChild(glowCursor);

// Track mouse movement for glow cursor
document.addEventListener('mousemove', (e) => {
    document.body.classList.add('mouse-active');
    
    const x = e.clientX - 150;
    const y = e.clientY - 150;
    
    glowCursor.style.transform = `translate(${x}px, ${y}px)`;
    
    // Add glow pulse effect periodically
    glowCursor.style.opacity = '0.7';
});

document.addEventListener('mouseleave', () => {
    document.body.classList.remove('mouse-active');
    glowCursor.style.opacity = '0';
});

// Add glow effects to medical objects on click/touch
const medicalObjects = document.querySelectorAll('.medical-object');

medicalObjects.forEach(obj => {
    obj.addEventListener('click', function(e) {
        this.classList.add('pulse-glow');
        setTimeout(() => {
            this.classList.remove('pulse-glow');
        }, 600);
        
        // Create ripple effect at click position
        createRipple(e.clientX, e.clientY);
    });
    
    obj.addEventListener('touchstart', function(e) {
        this.classList.add('pulse-glow');
        setTimeout(() => {
            this.classList.remove('pulse-glow');
        }, 600);
        
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            createRipple(touch.clientX, touch.clientY);
        }
    });
});

// Create ripple glow effect
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle at center, rgba(52, 211, 153, 0.6), rgba(52, 211, 153, 0.1))';
    ripple.style.boxShadow = '0 0 30px rgba(52, 211, 153, 0.8)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '5';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    // Animate ripple
    let size = 0;
    const interval = setInterval(() => {
        size += 8;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.opacity = Math.max(0, 1 - (size / 300));
        
        if (size > 300) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 20);
}

// Add glow effect to buttons on hover
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
    });
    
    button.addEventListener('click', function() {
        this.style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 600);
    });
});

// Touch/Tap glow for cards
document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.medicine-card') || e.target.closest('.service-card')) {
        const card = e.target.closest('.medicine-card') || e.target.closest('.service-card');
        if (card) {
            const touch = e.touches[0];
            createRipple(touch.clientX, touch.clientY);
        }
    }
});


// Add medicine to cart

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    total += price;

    displayCart();

    alert(name + " added to cart!");
}


// Display cart

function displayCart() {

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>No medicines added yet.</p>";

        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {

        cartItems.innerHTML += `
            <div class="cart-item">

                <span>
                    ${item.name}
                </span>

                <span>
                    ₹${item.price}
                </span>

                <button onclick="removeItem(${index})">
                    ❌
                </button>

            </div>
        `;

    });

    document.getElementById("total").innerText = total;
}


// Remove medicine

function removeItem(index) {

    total -= cart[index].price;

    cart.splice(index, 1);

    displayCart();

    document.getElementById("total").innerText = total;
}


// Search medicine

function searchMedicine() {

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(".medicine-card");

    cards.forEach(function(card) {

        const medicine =
            card
            .querySelector("h3")
            .innerText
            .toLowerCase();

        if (medicine.includes(search)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });
}


// Order button

function orderNow() {

    document
        .getElementById("medicines")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Checkout

function checkout() {

    if (cart.length === 0) {

        alert("Please add medicines to your cart.");

        return;
    }

    let message =
        "Order Details:%0A%0A";

    cart.forEach(function(item) {

        message +=
            item.name +
            " - ₹" +
            item.price +
            "%0A";

    });

    message +=
        "%0ATotal: ₹" +
        total;

    /*
       Replace this number with
       your medical shop WhatsApp number.

       Example:
       919876543210
    */

    const phone =
        "919876543210";

    const whatsappURL =
        "https://wa.me/" +
        phone +
        "?text=" +
        message;

    window.open(
        whatsappURL,
        "_blank"
    );
}
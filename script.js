
// ======================================
// PAPER & PETALS - MINI E-COMMERCE APP
// ======================================

// 1. PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Blush Pink Journal",
        price: 199,
        category: "Notebooks",
        emoji: "📔",
        color: "#f7e0df"
    },
    {
        id: 2,
        name: "Pastel Pen Set",
        price: 149,
        category: "Writing",
        emoji: "🖊️",
        color: "#e3e9f5"
    },
    {
        id: 3,
        name: "Daily Planner",
        price: 249,
        category: "Notebooks",
        emoji: "📒",
        color: "#f5e9ce"
    },
    {
        id: 4,
        name: "Floral Bookmark",
        price: 79,
        category: "Accessories",
        emoji: "🌸",
        color: "#f6dfe9"
    },
    {
        id: 5,
        name: "Cute Sticky Notes",
        price: 99,
        category: "Accessories",
        emoji: "🗒️",
        color: "#e5eddb"
    },
    {
        id: 6,
        name: "Premium Notebook",
        price: 299,
        category: "Notebooks",
        emoji: "📚",
        color: "#e6ddf0"
    },
    {
        id: 7,
        name: "Vintage Pencil Set",
        price: 129,
        category: "Writing",
        emoji: "✏️",
        color: "#f5e6d6"
    },
    {
        id: 8,
        name: "Desk Organizer",
        price: 349,
        category: "Accessories",
        emoji: "🗃️",
        color: "#e4e9e8"
    }
];


// 2. GET ELEMENTS

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const grandTotalElement = document.getElementById("grand-total");

const checkoutModal = document.getElementById("checkout-modal");


// 3. FORMAT PRICE IN INDIAN RUPEES

function formatPrice(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });
}


// 4. LOAD CART FROM LOCAL STORAGE

let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("paperPetalsCart")) || {};
    if (!cart || typeof cart !== "object" || Array.isArray(cart)) {
        cart = {};
    }
} catch (error) {
    cart = {};
}


// 5. RENDER PRODUCTS DYNAMICALLY

function renderProducts(category = "All") {

    const filteredProducts = category === "All"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">

            <div class="product-image" style="background:${product.color}">
                <span>${product.emoji}</span>
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button class="add-button" onclick="addToCart(${product.id})">
                        + Add
                    </button>

                </div>
            </div>
        </div>
    `).join("");
}


// 6. ADD PRODUCT TO CART

function addToCart(id) {

    cart[id] = (cart[id] || 0) + 1;

    saveCart();

}


// 7. CHANGE PRODUCT QUANTITY

function changeQuantity(id, delta) {

    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();

}


// 8. REMOVE PRODUCT

function removeItem(id) {

    delete cart[id];

    saveCart();

}


// 9. CALCULATE TOTALS USING REDUCE

function calculateTotals() {

    const subtotal = Object.keys(cart).reduce((sum, id) => {

        const product = products.find(
            item => item.id === Number(id)
        );

        if (!product) return sum;

        return sum + product.price * cart[id];

    }, 0);

    const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };

}


// 10. SAVE CART AND UPDATE PAGE

function saveCart() {

    localStorage.setItem(
        "paperPetalsCart",
        JSON.stringify(cart)
    );

    renderCart();

}


// 11. RENDER CART ITEMS

function renderCart() {

    const validItems = Object.entries(cart).filter(([id, quantity]) => {
        return products.some(product => product.id === Number(id))
            && Number.isInteger(quantity)
            && quantity > 0;
    });

    cart = Object.fromEntries(validItems);

    localStorage.setItem(
        "paperPetalsCart",
        JSON.stringify(cart)
    );

    const itemCount = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity,
        0
    );

    cartCount.textContent = itemCount;

    if (itemCount === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛍️</span>
                <h3>Your shopping bag is empty!</h3>
                <p>Let's find something lovely for you.</p>
            </div>
        `;

    } else {

        cartItems.innerHTML = Object.entries(cart).map(([id, quantity]) => {

            const product = products.find(
                item => item.id === Number(id)
            );

            return `
                <div class="cart-item">

                    <div class="cart-item-emoji"
                         style="background:${product.color}">
                        ${product.emoji}
                    </div>

                    <div class="cart-item-details">

                        <h4>${product.name}</h4>

                        <p>${formatPrice(product.price)} each</p>

                        <div class="quantity-control">

                            <button onclick="changeQuantity(${id}, -1)">
                                −
                            </button>

                            <span>${quantity}</span>

                            <button onclick="changeQuantity(${id}, 1)">
                                +
                            </button>

                        </div>

                        <button class="remove-button"
                                onclick="removeItem(${id})">
                            Remove
                        </button>

                    </div>

                    <span class="line-total">
                        ${formatPrice(product.price * quantity)}
                    </span>

                </div>
            `;

        }).join("");

    }

    updateTotals();

}


// 12. UPDATE PRICE SUMMARY

function updateTotals() {

    const totals = calculateTotals();

    subtotalElement.textContent = formatPrice(totals.subtotal);

    deliveryElement.textContent = totals.delivery === 0
        ? "FREE"
        : formatPrice(totals.delivery);

    grandTotalElement.textContent = formatPrice(totals.total);

}


// 13. CATEGORY FILTERS

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderProducts(button.dataset.category);

    });

});


// 14. CHECKOUT PREVIEW

document.getElementById("checkout-btn").addEventListener("click", () => {

    const totals = calculateTotals();

    if (totals.subtotal === 0) {
        alert("Your cart is empty! Add some lovely products first.");
        return;
    }

    const checkoutItems = document.getElementById("checkout-items");

    checkoutItems.innerHTML = Object.entries(cart).map(([id, quantity]) => {

        const product = products.find(
            item => item.id === Number(id)
        );

        return `
            <div class="checkout-item">
                <span>${product.emoji} ${product.name} × ${quantity}</span>
                <strong>${formatPrice(product.price * quantity)}</strong>
            </div>
        `;

    }).join("");

    document.getElementById("modal-subtotal").textContent =
        formatPrice(totals.subtotal);

    document.getElementById("modal-delivery").textContent =
        totals.delivery === 0 ? "FREE" : formatPrice(totals.delivery);

    document.getElementById("modal-total").textContent =
        formatPrice(totals.total);

    checkoutModal.showModal();

});


// 15. CLOSE CHECKOUT MODAL

document.getElementById("close-modal").addEventListener("click", () => {
    checkoutModal.close();
});

checkoutModal.addEventListener("click", (event) => {

    if (event.target === checkoutModal) {
        checkoutModal.close();
    }

});


// 16. DEMO ORDER CONFIRMATION

document.getElementById("confirm-order").addEventListener("click", () => {

    alert("Thank you for visiting Paper & Petals! 🌷 Your demo order has been confirmed.");

    cart = {};

    saveCart();

    checkoutModal.close();

});


// 17. INITIALIZE WEBSITE

renderProducts();

renderCart();

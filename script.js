const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");
const trendingContainer = document.getElementById("trending-products");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");
const API_BASE = "https://fakestoreapi.com";

// Cart
let cart = [];

// Close modal
closeBtn.onclick = () => modal.classList.add("hidden");

// Load categories
function loadCategories() {
    fetch(`${API_BASE}/products/categories`)
        .then(res => res.json())
        .then(data => {
            categoriesContainer.innerHTML = "";

            const allBtn = document.createElement("button");
            allBtn.innerText = "All";
            allBtn.classList.add("active-cat");
            allBtn.onclick = () => {
                document.querySelectorAll('#categories button').forEach(b => b.classList.remove('active-cat'));
                allBtn.classList.add('active-cat');
                loadProducts('all');
            };
            categoriesContainer.appendChild(allBtn);

            data.forEach(cat => {
                const btn = document.createElement("button");
                btn.innerText = cat;
                btn.onclick = () => {
                    document.querySelectorAll('#categories button').forEach(b => b.classList.remove('active-cat'));
                    btn.classList.add('active-cat');
                    loadProducts(cat);
                };
                categoriesContainer.appendChild(btn);
            });
        });
}

// Load products
function loadProducts(category) {
    productsContainer.innerHTML = "<p class='loading'>Loading products...</p>";

    let url = category === "all"
        ? `${API_BASE}/products`
        : `${API_BASE}/products/category/${category}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            productsContainer.innerHTML = "";
            data.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" />
                    <span class="badge">${product.category}</span>
                    <h4>${product.title.slice(0, 40)}...</h4>
                    <p class="price">$${product.price}</p>
                    <p class="rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
                    <div class="card-buttons">
                        <button class="btn-details" onclick="showDetails(${product.id})">Details</button>
                        <button class="btn-cart" onclick="addToCart(${product.id}, '${product.title.slice(0, 30)}', ${product.price})">Add to Cart</button>
                    </div>
                `;
                productsContainer.appendChild(card);
            });
        });
}

// Trending products — first 3
function loadTrending() {
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(data => {
            data.slice(0, 3).forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" />
                    <span class="badge">${product.category}</span>
                    <h4>${product.title.slice(0, 40)}...</h4>
                    <p class="price">$${product.price}</p>
                    <p class="rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
                    <div class="card-buttons">
                        <button class="btn-details" onclick="showDetails(${product.id})">Details</button>
                        <button class="btn-cart" onclick="addToCart(${product.id}, '${product.title.slice(0, 30)}', ${product.price})">Add to Cart</button>
                    </div>
                `;
                trendingContainer.appendChild(card);
            });
        });
}

// Show details modal
function showDetails(id) {
    modalBody.innerHTML = "<p class='loading'>Loading...</p>";
    modal.classList.remove("hidden");

    fetch(`${API_BASE}/products/${id}`)
        .then(res => res.json())
        .then(product => {
            modalBody.innerHTML = `
                <img src="${product.image}" width="120" alt="${product.title}" />
                <h3>${product.title}</h3>
                <span class="badge">${product.category}</span>
                <p class="modal-desc">${product.description}</p>
                <p class="price">Price: $${product.price}</p>
                <p class="rating">⭐ ${product.rating.rate} (${product.rating.count} reviews)</p>
                <button class="btn-cart" onclick="addToCart(${product.id}, '${product.title.slice(0, 30)}', ${product.price}); modal.classList.add('hidden')">Add to Cart</button>
            `;
        });
}

// Add to cart
function addToCart(id, title, price) {
    cart.push({ id, title, price });
    document.getElementById('cart-count').innerText = cart.length;
}

// Initial load
loadCategories();
loadTrending();
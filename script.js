const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");
const trendingContainer = document.getElementById("trending-products");
const API_BASE = "https://fakestoreapi.com";

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
                `;
                productsContainer.appendChild(card);
            });
        });
}

// Trending products — top 3 by rating
function loadTrending() {
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => b.rating.rate - a.rating.rate);
            sorted.slice(0, 3).forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" />
                    <span class="badge">${product.category}</span>
                    <h4>${product.title.slice(0, 40)}...</h4>
                    <p class="price">$${product.price}</p>
                    <p class="rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
                `;
                trendingContainer.appendChild(card);
            });
        });
}

// Initial load
loadCategories();
loadTrending();
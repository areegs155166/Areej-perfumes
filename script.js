
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const products = [
    { id: "398", category: "men", price: 180, style: "dark" },
    { id: "366", category: "men", price: 220, style: "square" },
    { id: "345", category: "men", price: 160, style: "classic" },
    { id: "327", category: "men", price: 250, style: "round" },

    { id: "404", category: "women", price: 190, style: "crystal" },
    { id: "467", category: "women", price: 230, style: "round" },
    { id: "432", category: "women", price: 175, style: "classic" },
    { id: "489", category: "women", price: 260, style: "square" },

    { id: "555", category: "unisex", price: 200, style: "classic" },
    { id: "578", category: "unisex", price: 240, style: "square" },
    { id: "567", category: "unisex", price: 185, style: "round" },
    { id: "589", category: "unisex", price: 270, style: "dark" },

    { id: "111", category: "kids", price: 90, style: "crystal" },
    { id: "222", category: "kids", price: 110, style: "round" },
    { id: "333", category: "kids", price: 95, style: "classic" },
    { id: "444", category: "kids", price: 120, style: "square" }
  ];

  const categoryNames = {
    men: "عطور رجالية",
    women: "عطور نسائية",
    unisex: "عطور للجنسين",
    kids: "عطور الأطفال"
  };

  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const emptyMessage = document.getElementById("emptyMessage");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const categoryCards = document.querySelectorAll(".collection-card");

  const cartToggle = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutButton = document.getElementById("checkoutButton");
  const toast = document.getElementById("toast");

  const requiredElements = [
    productsGrid, searchInput, emptyMessage, cartToggle,
    cartPanel, cartOverlay, closeCart, cartItems,
    cartCount, cartTotal, checkoutButton, toast
  ];

  if (requiredElements.some(function (element) { return !element; })) {
    console.error("AREEJ: يوجد عنصر HTML مفقود. راجعي index.html.");
    return;
  }

  let currentFilter = "all";
  let cart = [];

  function renderProducts() {
    const searchValue = searchInput.value.trim();

    const filtered = products.filter(function (product) {
      const categoryMatch =
        currentFilter === "all" || product.category === currentFilter;
      const searchMatch = product.id.includes(searchValue);
      return categoryMatch && searchMatch;
    });

    productsGrid.innerHTML = "";

    filtered.forEach(function (product, index) {
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.animationDelay = (index * 0.045) + "s";

      card.innerHTML = `
        <div class="product-art ${product.category}">
          <div class="perfume-bottle bottle-${product.style}">
            <div class="perfume-cap"></div>
            <div class="perfume-neck"></div>
            <div class="perfume-glass">
              <strong>AREEJ</strong>
              <small>PERFUMES</small>
              <span>A</span>
            </div>
          </div>
        </div>
        <div class="product-info">
          <h3>عطر ${product.id}</h3>
          <p class="product-category">${categoryNames[product.category]}</p>
          <p class="product-price">${product.price} ر.س</p>
          <button class="add-button" data-id="${product.id}">
            أضيفي إلى الحقيبة
          </button>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    emptyMessage.hidden = filtered.length !== 0;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function addToCart(id) {
    const item = cart.find(function (product) {
      return product.id === id;
    });

    if (item) {
      item.quantity++;
    } else {
      cart.push({ id: id, quantity: 1 });
    }

    renderCart();
    showToast("تمت إضافة العطر إلى حقيبتك");
  }

  function changeQuantity(id, amount) {
    const item = cart.find(function (product) {
      return product.id === id;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      cart = cart.filter(function (product) {
        return product.id !== id;
      });
    }

    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(function (item) {
      const product = products.find(function (p) {
        return p.id === item.id;
      });

      if (!product) return;

      total += product.price * item.quantity;
      count += item.quantity;

      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div>
          <h4>عطر ${product.id}</h4>
          <p>${product.price} ر.س</p>
        </div>
        <div class="quantity-controls">
          <button type="button" data-action="minus" data-id="${product.id}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-id="${product.id}">+</button>
        </div>
      `;

      cartItems.appendChild(row);
    });

    if (cart.length === 0) {
      cartItems.textContent = "حقيبتك فارغة حاليًا.";
    }

    cartCount.textContent = count;
    cartTotal.textContent = total + " ر.س";
  }

  function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
  }

  function closeCartPanel() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
  }

  function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );
    });

    renderProducts();
  }

  productsGrid.addEventListener("click", function (event) {
    const button = event.target.closest(".add-button");
    if (button) addToCart(button.dataset.id);
  });

  searchInput.addEventListener("input", renderProducts);

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.dataset.filter);
    });
  });

  categoryCards.forEach(function (card) {
    card.addEventListener("click", function () {
      setFilter(card.dataset.category);
      document.getElementById("products").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  cartToggle.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartPanel);
  cartOverlay.addEventListener("click", closeCartPanel);

  cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "plus") {
      changeQuantity(button.dataset.id, 1);
    } else if (button.dataset.action === "minus") {
      changeQuantity(button.dataset.id, -1);
    }
  });

  checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("أضيفي عطرًا إلى حقيبتك أولًا");
      return;
    }

    showToast("هذا متجر تجريبي ولا ينفذ عمليات دفع");
  });

  renderProducts();
  renderCart();

  console.log("AREEJ PERFUMES: تم تحميل 16 عطرًا بنجاح.");
});

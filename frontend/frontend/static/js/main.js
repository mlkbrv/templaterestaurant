// main.js

document.addEventListener('DOMContentLoaded', function () {
  // --- Выбор столика ---
  const tableModal = document.getElementById('table-modal');
  const tableInput = document.getElementById('table-number-input');
  const tableSubmit = document.getElementById('table-number-submit');
  let tableNumber = localStorage.getItem('tableNumber');

  function showTableModal() {
    tableModal.classList.remove('hidden');
  }
  function hideTableModal() {
    tableModal.classList.add('hidden');
  }
  if (!tableNumber) {
    showTableModal();
  } else {
    hideTableModal();
  }
  tableSubmit.addEventListener('click', function () {
    if (tableInput.value) {
      tableNumber = tableInput.value;
      localStorage.setItem('tableNumber', tableNumber);
      hideTableModal();
    }
  });

  // --- Категории и анимация ---
  const categoryBtns = document.querySelectorAll('.category-btn');
  const dishesList = document.getElementById('dishes-list');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-category');
      // Анимация скрытия
      dishesList.classList.add('opacity-0');
      setTimeout(() => {
        document.querySelectorAll('.dish-card').forEach(card => {
          card.style.display = card.getAttribute('data-category') === cat ? '' : 'none';
        });
        // Анимация появления
        dishesList.classList.remove('opacity-0');
      }, 300);
    });
  });

  // --- Корзина ---
  let cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const openCartBtn = document.getElementById('open-cart');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const orderSuccess = document.getElementById('order-success');
  const closeSuccess = document.getElementById('close-success');

  function updateCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    for (let dishId in cart) {
      const item = cart[dishId];
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center mb-2';
      div.innerHTML = `<span>${item.name} × ${item.qty}</span>
        <span>${item.price * item.qty} ₽</span>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-dish="${dishId}">-</button>`;
      cartItemsDiv.appendChild(div);
      total += item.price * item.qty;
    }
    cartTotalSpan.textContent = total + ' ₽';
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  openCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    updateCart();
  });
  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });

  cartItemsDiv.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
      const dishId = e.target.getAttribute('data-dish');
      if (cart[dishId]) {
        cart[dishId].qty--;
        if (cart[dishId].qty <= 0) delete cart[dishId];
        updateCart();
      }
    }
  });

  // --- Добавление блюда в корзину ---
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const dishId = btn.getAttribute('data-dish');
      const card = btn.closest('.dish-card');
      const name = card.querySelector('h3').textContent;
      const price = parseInt(card.querySelector('span.font-bold').textContent);
      if (!cart[dishId]) cart[dishId] = { name, price, qty: 0 };
      cart[dishId].qty++;
      updateCart();
    });
  });

  // --- Оформление заказа ---
  checkoutBtn.addEventListener('click', function () {
    if (!tableNumber) {
      showTableModal();
      return;
    }
    const items = Object.entries(cart).map(([dish, data]) => ({ dish, qty: data.qty }));
    if (!items.length) return;
    fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        table_number: tableNumber,
        items: items
      })
    }).then(r => {
      if (r.ok) {
        cart = {};
        updateCart();
        cartModal.classList.add('hidden');
        orderSuccess.classList.remove('hidden');
        localStorage.removeItem('cart');
      }
    });
  });

  closeSuccess.addEventListener('click', function () {
    orderSuccess.classList.add('hidden');
  });

  // --- Детальный просмотр блюда ---
  const dishDetailModal = document.getElementById('dish-detail-modal');
  const closeDishDetail = document.getElementById('close-dish-detail');
  const detailImage = document.getElementById('detail-image');
  const detailName = document.getElementById('detail-name');
  const detailDescription = document.getElementById('detail-description');
  const detailPrice = document.getElementById('detail-price');
  const detailAddToCart = document.getElementById('detail-add-to-cart');
  let currentDetailDishId = null;

  document.querySelectorAll('.dish-card').forEach(card => {
    card.addEventListener('click', function (e) {
      // Не открывать модалку, если клик по кнопке "+"
      if (e.target.classList.contains('add-to-cart')) return;
      const dishId = card.getAttribute('data-dish-id');
      const name = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      const price = card.querySelector('span.font-bold').textContent;
      const img = card.querySelector('img');
      detailName.textContent = name;
      detailDescription.textContent = description;
      detailPrice.textContent = price;
      detailImage.src = img ? img.src : '';
      detailImage.alt = name;
      currentDetailDishId = dishId;
      dishDetailModal.classList.remove('hidden');
    });
  });
  closeDishDetail.addEventListener('click', function () {
    dishDetailModal.classList.add('hidden');
  });
  detailAddToCart.addEventListener('click', function () {
    if (!currentDetailDishId) return;
    // Найти карточку блюда по id
    const card = document.querySelector('.dish-card[data-dish-id="' + currentDetailDishId + '"]');
    const name = card.querySelector('h3').textContent;
    const price = parseInt(card.querySelector('span.font-bold').textContent);
    if (!cart[currentDetailDishId]) cart[currentDetailDishId] = { name, price, qty: 0 };
    cart[currentDetailDishId].qty++;
    updateCart();
    dishDetailModal.classList.add('hidden');
  });

  // --- CSRF helper ---
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // --- Инициализация ---
  updateCart();
}); 
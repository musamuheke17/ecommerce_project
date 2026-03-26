// Global Ecommerce Script - Navigation, Cart, Sliders, Admin

// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Navigation Active State
document.addEventListener('DOMContentLoaded', function() {
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Cart functionality
  updateCartCount();
  setupCart();
  setupSliders();
  setupAdmin();
});

// Navigation smooth scrolling / smart navigation
function scrollToProducts() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'products.html') {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = 'products.html';
  }
}

// Support functions
function openChat() {
  // Create/show chat modal
  let chatModal = document.getElementById('chatModal');
  if (!chatModal) {
    chatModal = document.createElement('div');
    chatModal.id = 'chatModal';
    chatModal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;';
    chatModal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; max-height: 80vh; overflow-y: auto;">
        <h3>Live Chat <span onclick="closeChat()" style="float: right; cursor: pointer; font-size: 1.5rem;">&times;</span></h3>
        <div style="height: 300px; border: 1px solid #e2e8f0; margin: 1rem 0; padding: 1rem; overflow-y: auto; background: #f8fafc;">Chat history here...</div>
        <input type="text" placeholder="Type your message..." style="width: 70%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
        <button class="btn" style="width: 28%; margin-left: 2%;">Send</button>
      </div>
    `;
    document.body.appendChild(chatModal);
  }
  chatModal.style.display = 'flex';
  window.closeChat = closeChat;
}

function closeChat() {
  const chatModal = document.getElementById('chatModal');
  if (chatModal) chatModal.remove();
}

function callSupport() {
  alert('Calling TechStore Support at (555) 123-4567');
  window.location.href = 'tel:5551234567';
}

// Cart Functions
function setupCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  if (cartBtn) cartBtn.addEventListener('click', toggleCart);
  if (cartModal) {
    // Close on outside click
    cartModal.addEventListener('click', function(e) {
      if (e.target === cartModal) closeCart();
    });
  }
}

function toggleCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
  document.getElementById('modalCartCount') && (document.getElementById('modalCartCount').textContent = count);
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function checkout() {
  alert('Redirecting to checkout...');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  closeCart();
}

// Image Sliders
function setupSliders() {
  document.querySelectorAll('.slider').forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    const prev = slider.querySelector('.prev');
    const next = slider.querySelector('.next');
    
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
    
    if (prev) prev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
    
    if (next) next.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
    
    // Auto slide
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  });
}

// Smooth page transitions
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('http') && !href.startsWith('mailto')) {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  });
});

// Admin Panel
function setupAdmin() {
  // Simple demo admin functionality
  const adminLinks = document.querySelectorAll('.admin-link');
  adminLinks.forEach(link => {
    link.addEventListener('click', function() {
      const page = this.dataset.page;
      showAdminPage(page);
    });
  });
}

function showAdminPage(page) {
  // Hide all admin pages, show selected
  document.querySelectorAll('.admin-page').forEach(p => p.style.display = 'none');
  document.getElementById(page + '-page')?.style.display = 'block';
}

// Notification Panel Toggle
function toggleNotification() {
  const panel = document.getElementById('notificationPanel');
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
}

// Settings Save (demo)
function saveSettings() {
  const websiteName = document.getElementById('websiteName').value;
  alert(`Settings saved! Website Name: ${websiteName}`);
}

// Prevent btn clicks from card click
document.querySelectorAll('.product-card .btn, .product-card .btn-buy-now').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});

// Add to Cart buttons
document.querySelectorAll('.product-card .btn:not(.btn-buy-now)').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.product-card');
    const product = {
      id: card.dataset.productId || card.querySelector('.product-title').textContent.toLowerCase().replace(/\s+/g, '-'),
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
      image: card.querySelector('.product-image').src
    };
    addToCart(product);
  });
});

// Buy Now buttons
document.querySelectorAll('.btn-buy-now').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.product-card');
    const product = {
      id: card.dataset.productId || card.querySelector('.product-title').textContent.toLowerCase().replace(/\s+/g, '-'),
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
      image: card.querySelector('.product-image').src
    };
    addToCart(product);
    const detailsUrl = 'product-details.html?id=' + product.id;
    window.location.href = detailsUrl;
  });
});

// Product card click to details
document.querySelectorAll('.product-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
      const productId = this.dataset.productId || this.querySelector('.product-title').textContent.toLowerCase().replace(/\s+/g, '-');
      window.location.href = 'product-details.html?id=' + productId;
    }
  });
});

// Buy Now buttons
document.querySelectorAll('.btn-buy-now').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const card = this.closest('.product-card');
    const product = {
      id: card.dataset.productId || card.querySelector('.product-title').textContent.toLowerCase().replace(/\s+/g, '-'),
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
      image: card.querySelector('.product-image').src
    };
    addToCart(product);
    setTimeout(() => {
      const detailsUrl = 'product-details.html?id=' + product.id;
      window.location.href = detailsUrl;
    }, 200);
  });
});

// Form Submissions & Support helpers
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
  });
});

// Support page helpers
function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

function searchArticles(query) {
  // Simple demo search - highlight matching articles
  console.log('Searching articles for:', query);
  alert('Searching for: ' + query + ' (demo - check console)');
}


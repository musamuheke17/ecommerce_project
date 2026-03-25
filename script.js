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

// Navigation smooth scrolling
function scrollToProducts() {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
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

// Product Add to Cart Buttons
document.querySelectorAll('.product-card .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.product-card');
    const product = {
      id: card.querySelector('.product-title').textContent.toLowerCase().replace(/\s+/g, '-'),
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
      image: card.querySelector('.product-image').src
    };
    addToCart(product);
  });
});

// Form Submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
  });
});


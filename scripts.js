// ── SHARED DATA ──────────────────────────────────────────────
const carData = {
  evoque: {
    name: 'Range Rover Evoque',
    price: '₹67,00,000',
    specs: [
      ['Engine', '1997cc'],
      ['Fuel Type', 'Diesel'],
      ['Transmission', 'Automatic'],
      ['Mileage', '15 km/l'],
      ['Top Speed', '213 km/h'],
      ['0–100 km/h', '8.5 seconds'],
      ['Drive Type', 'AWD'],
      ['Seats', '5']
    ]
  },
  sport: {
    name: 'Range Rover Sport',
    price: '₹87,00,000',
    specs: [
      ['Engine', '2997cc'],
      ['Fuel Type', 'Petrol / Diesel'],
      ['Transmission', 'Automatic'],
      ['Mileage', '12 km/l'],
      ['Top Speed', '234 km/h'],
      ['0–100 km/h', '5.9 seconds'],
      ['Drive Type', 'AWD'],
      ['Seats', '5']
    ]
  },
  velar: {
    name: 'Range Rover Velar',
    price: '₹1,40,00,000',
    specs: [
      ['Engine', '1997cc'],
      ['Fuel Type', 'Petrol'],
      ['Transmission', 'Automatic'],
      ['Mileage', '15.8 km/l'],
      ['Top Speed', '210 km/h'],
      ['0–100 km/h', '8.3 seconds'],
      ['Drive Type', 'AWD'],
      ['Seats', '5']
    ]
  },
  defender: {
    name: 'Defender',
    price: '₹1,47,00,000',
    specs: [
      ['Engine', '4500cc'],
      ['Fuel Type', 'Diesel'],
      ['Transmission', 'Automatic'],
      ['Mileage', '10 km/l'],
      ['Top Speed', '240 km/h'],
      ['0–100 km/h', '5.7 seconds'],
      ['Drive Type', '4WD'],
      ['Seats', '5–7']
    ]
  }
};

// ── NAVBAR SCROLL ──────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (target >= 100 ? '+' : '');
    if (current >= target) clearInterval(interval);
  }, 25);
}

// ── INTERSECTION OBSERVER ──────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate stat numbers
      const numEl = entry.target.querySelector('[data-target]');
      if (numEl) {
        animateCounter(numEl, parseInt(numEl.dataset.target));
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in, .stat-item').forEach(el => observer.observe(el));

// ── MODAL ──────────────────────────────────────────────────
function openModal(key) {
  const data = carData[key];
  if (!data) return;
  document.getElementById('modalTitle').textContent = data.name;
  document.getElementById('modalPrice').textContent = data.price;
  const tbody = document.getElementById('modalSpecs');
  if (tbody) {
    tbody.innerHTML = data.specs.map(([label, val]) =>
      `<tr><td>${label}</td><td>${val}</td></tr>`
    ).join('');
  }
  const tdBtn = document.getElementById('modalTestDrive');
  const bnBtn = document.getElementById('modalBookNow');
  if (tdBtn) tdBtn.onclick = () => { closeModalBtn(); bookTestDrive(data.name); };
  if (bnBtn) bnBtn.onclick = () => { closeModalBtn(); bookCar(data.name); };
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalBtn();
}

function closeModalBtn() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(title, body) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastBody = document.getElementById('toastBody');
  if (!toast) return;
  toastTitle.textContent = title;
  toastBody.textContent = body;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}


// ── BOOKING MODAL INJECTION & LOGIC ────────────────────────
function ensureBookingModalExists() {
  if (document.getElementById('bookingModalOverlay')) return;

  const modalHtml = `
    <div class="modal-overlay" id="bookingModalOverlay" onclick="closeBookingModal(event)">
      <div class="modal" id="bookingModal">
        <button class="modal-close" onclick="closeBookingModalBtn()">✕</button>
        <h3 id="bookingModalTitle">Book Test Drive</h3>
        <p id="bookingModalSubtitle" style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;"></p>
        <form id="bookingForm" onsubmit="submitBooking(event)">
          <input type="hidden" id="bookingCarName">
          <input type="hidden" id="bookingMode">
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="bookingName" style="display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Full Name</label>
            <input type="text" id="bookingName" required style="width: 100%; background: var(--dark-2); border: 1px solid rgba(255,255,255,0.1); color: var(--white); padding: 12px; border-radius: 3px; font-family: inherit; outline: none;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="bookingPhone" style="display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Phone Number (10 digits)</label>
            <input type="tel" id="bookingPhone" pattern="[0-9]{10}" required style="width: 100%; background: var(--dark-2); border: 1px solid rgba(255,255,255,0.1); color: var(--white); padding: 12px; border-radius: 3px; font-family: inherit; outline: none;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="bookingLocation" style="display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Preferred Showroom</label>
            <select id="bookingLocation" required style="width: 100%; background: var(--dark-2); border: 1px solid rgba(255,255,255,0.1); color: var(--white); padding: 12px; border-radius: 3px; font-family: inherit; outline: none;">
              <option value="New Delhi">New Delhi (CP Showroom)</option>
              <option value="Mumbai">Mumbai (Worli Showroom)</option>
              <option value="Bengaluru">Bengaluru (Lavelle Road Showroom)</option>
              <option value="Chennai">Chennai (OMR Showroom)</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 24px;">
            <label for="bookingDate" style="display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Preferred Date</label>
            <input type="date" id="bookingDate" required style="width: 100%; background: var(--dark-2); border: 1px solid rgba(255,255,255,0.1); color: var(--white); padding: 12px; border-radius: 3px; font-family: inherit; outline: none;">
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; text-align: center;">Confirm Booking</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openBookingModal(carName, mode) {
  ensureBookingModalExists();
  document.getElementById('bookingCarName').value = carName;
  document.getElementById('bookingMode').value = mode;

  const title = mode === 'test-drive' ? 'Book Test Drive' : 'Request Quotation & Booking';
  const subtitle = mode === 'test-drive' ? `Experience the thrill of the ${carName}` : `Initiate your order for the exclusive ${carName}`;

  document.getElementById('bookingModalTitle').textContent = title;
  document.getElementById('bookingModalSubtitle').textContent = subtitle;

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('bookingDate').value = tomorrow.toISOString().substring(0, 10);

  document.getElementById('bookingModalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal(e) {
  if (e.target === document.getElementById('bookingModalOverlay')) closeBookingModalBtn();
}

function closeBookingModalBtn() {
  const overlay = document.getElementById('bookingModalOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function submitBooking(e) {
  e.preventDefault();
  const carName = document.getElementById('bookingCarName').value;
  const mode = document.getElementById('bookingMode').value;
  const name = document.getElementById('bookingName').value;
  const phone = document.getElementById('bookingPhone').value;
  const location = document.getElementById('bookingLocation').value;
  const date = document.getElementById('bookingDate').value;

  closeBookingModalBtn();

  if (mode === 'test-drive') {
    showToast('Test Drive Booked! 🎉', `Thank you, ${name}! Your test drive for ${carName} is scheduled on ${date} at our ${location} showroom.`);
  } else {
    showToast('Booking Initiated! 🏆', `Congratulations, ${name}! Our executive from ${location} showroom will contact you shortly regarding the ${carName}.`);
  }
  document.getElementById('bookingForm').reset();
}

// ── BOOK TEST DRIVE ────────────────────────────────────────
function bookTestDrive(carName) {
  openBookingModal(carName, 'test-drive');
}

// ── BOOK CAR ───────────────────────────────────────────────
function bookCar(carName) {
  openBookingModal(carName, 'purchase');
}


// ── CONTACT FORM ───────────────────────────────────────────
function submitContact(e) {
  e.preventDefault();
  showToast('Message Sent! ✉️', 'Thank you for reaching out. Our team will get back to you within 24 hours.');
  e.target.reset();
}

// ── DETAILS PAGE: FILTER ───────────────────────────────────
function filterCards(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.full-model-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? 'grid' : 'none';
  });
}

// ── REGISTER FORM (fallback for pages using register-form id) ──
const regForm = document.getElementById('register-form');
if (regForm && !regForm.getAttribute('onsubmit')) {
  regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Registration Successful! 🎉', 'Welcome to the Range Rover family!');
    setTimeout(() => { window.location.href = 'details.html'; }, 2000);
  });
}

// ── PAGE LOADER ────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
    setTimeout(() => loader.remove(), 1000);
  }
});

// ── BACK TO TOP ────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── MOBILE MENU ────────────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.getElementById('mobileOverlay').classList.toggle('active');
  document.getElementById('hamburgerBtn').classList.toggle('active');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}
const hamburgerBtn = document.getElementById('hamburgerBtn');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', toggleMobileMenu);
}
const mobileOverlay = document.getElementById('mobileOverlay');
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', toggleMobileMenu);
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── LUXURY THEME SWITCHER ─────────────────────────────────
function initializeThemeToggle() {
  if (document.getElementById('themeToggleBtn')) return;
  const navbarNav = document.querySelector('.navbar nav');
  if (!navbarNav) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'themeToggleBtn';
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Toggle light/dark theme');
  toggleBtn.style.marginLeft = '16px';

  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.innerHTML = '🌙';
  } else {
    toggleBtn.innerHTML = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    toggleBtn.innerHTML = isLight ? '🌙' : '☀️';
  });

  navbarNav.appendChild(toggleBtn);
}

document.addEventListener('DOMContentLoaded', initializeThemeToggle);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initializeThemeToggle();
}


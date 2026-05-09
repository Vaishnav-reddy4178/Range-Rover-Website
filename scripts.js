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

// ── BOOK TEST DRIVE ────────────────────────────────────────
function bookTestDrive(carName) {
  const name = window.prompt(`Book a test drive for the ${carName}.\n\nEnter your name:`);
  if (!name) return;
  const phone = window.prompt('Enter your phone number (10 digits):');
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    showToast('Invalid Number', 'Please enter a valid 10-digit phone number.');
    return;
  }
  showToast('Test Drive Booked! 🎉', `Thank you, ${name}! We'll call you at ${phone} to confirm your ${carName} test drive.`);
}

// ── BOOK CAR ───────────────────────────────────────────────
function bookCar(carName) {
  const name = window.prompt(`Booking: ${carName}\n\nEnter your full name:`);
  if (!name) return;
  const location = window.prompt('Enter your city / preferred showroom location:');
  if (!location) { showToast('Booking Cancelled', 'Location is required to proceed.'); return; }
  const phone = window.prompt('Enter your phone number (10 digits):');
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    showToast('Invalid Number', 'Please enter a valid 10-digit phone number.');
    return;
  }
  showToast('Booking Confirmed! 🏆', `Thank you, ${name}! Your ${carName} booking from ${location} is confirmed. We'll contact you at ${phone}.`);
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

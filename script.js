// ===== PAGE NAVIGATION =====
// ===== PAGE COLOR THEMES =====
const pageColors = {
  home:    '#00d4ff',   // Blue
  about:   '#a855f7',   // Purple
  work:    '#ef4444',   // Red
  stories: '#f97316',   // Orange
  contact: '#4ade80',   // Green
};

// ===== SHOW PAGE =====
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));

  // Show selected page
  document.getElementById(pageId)?.classList.add('active');

  // Activate nav link
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));

  // Apply body class for CSS variable theming
  const body = document.body;
  body.className = body.className.replace(/page-\w+/g, '').trim();
  body.classList.add(`page-${pageId}`);

  // Also set CSS variable directly for full browser support
  document.documentElement.style.setProperty('--cyan', pageColors[pageId]);

  // Close mobile nav
  document.getElementById('mobileNav')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== NAV LINKS =====
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = document.body.classList.contains('light-mode') ? '☾' : '☀';
});

// ===== HAMBURGER =====
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileNav').classList.toggle('open');
});

// ===== TIMELINE TOGGLE =====
function toggleTimeline(header) {
  const card = header.parentElement;
  const body = card.querySelector('.timeline-card-body');
  const arrow = header.querySelector('.tl-arrow');
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  arrow.textContent = isOpen ? '›' : '▾';
  card.classList.toggle('expanded', !isOpen);
}

// Init home page color on load
showPage('home');

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // Update desktop nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });

  // Update mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash
  history.pushState(null, null, '#' + pageId);
}

// Nav link clicks
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// "Let's Talk" button → Contact
document.querySelector('.btn-talk')?.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('contact');
});

// Footer links
document.querySelectorAll('#footer a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const hash = link.getAttribute('href').replace('#', '');
    const validPages = ['home', 'about', 'work', 'stories', 'contact'];
    if (validPages.includes(hash)) {
      e.preventDefault();
      showPage(hash);
    }
  });
});

// Handle initial hash
function handleHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const validPages = ['home', 'about', 'work', 'stories', 'contact'];
  if (validPages.includes(hash)) showPage(hash);
}
handleHash();
window.addEventListener('popstate', handleHash);

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
let isDark = true;
themeToggle?.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  themeToggle.textContent = isDark ? '☀' : '🌙';
  // Update navbar bg for light mode
  document.getElementById('navbar').style.background = isDark
    ? 'rgba(10,10,14,0.88)'
    : 'rgba(240,240,245,0.92)';
});

// ===== TIMELINE ACCORDION =====
function toggleTimeline(header) {
  const card = header.closest('.timeline-card');
  const body = card.querySelector('.timeline-card-body');
  const arrow = header.querySelector('.tl-arrow');
  const isOpen = body.style.display !== 'none';

  body.style.display = isOpen ? 'none' : 'block';
  arrow.textContent = isOpen ? '›' : '▾';
  card.classList.toggle('expanded', !isOpen);
}

// ===== EXPERIENCE TIMER (Live counter) =====
function updateExperience() {
  const start = new Date('2018-06-01'); // Approximate start
  const now = new Date();
  const diff = now - start;

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  const expDisplay = document.querySelector('.exp-display');
  if (expDisplay) {
    const nums = expDisplay.querySelectorAll('.exp-num');
    if (nums[0]) nums[0].textContent = String(years).padStart(2, '0');
    if (nums[1]) nums[1].textContent = String(months).padStart(2, '0');
    if (nums[2]) nums[2].textContent = String(days).padStart(2, '0');
  }
}
updateExperience();

// ===== HOVER GLOW EFFECT on cards =====
document.querySelectorAll('.card, .project-card, .story-card, .contact-channel-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glow-x', x + '%');
    card.style.setProperty('--glow-y', y + '%');
  });
});

// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item, .project-card, .story-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== STAT COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const start = 0;
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = (target > 999 ? '+' : '') + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      const targets = [4, 100, 12775];
      const suffixes = ['+', '%', ''];
      statNums.forEach((el, i) => animateCounter(el, targets[i], suffixes[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsCard = document.querySelector('.stats-card');
if (statsCard) statsObserver.observe(statsCard);

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Mobile nav link clicks
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) showPage(page);
    // Update active state
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    // Close drawer
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (mobileNav?.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }
});

// Sync mobile nav active state with page changes
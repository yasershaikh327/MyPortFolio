// ===== PAGE COLOR THEMES =====
const pageColors = {
  home:    '#00d4ff',
  about:   '#a855f7',
  work:    '#ef4444',
  stories: '#f97316',
  contact: '#4ade80',
};

// ===== SHOW PAGE (single definition) =====
function showPage(pageId) {
  const validPages = ['home', 'about', 'work', 'stories', 'contact'];
  if (!validPages.includes(pageId)) pageId = 'home';

  // Hide all pages, show target
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Apply page color
  document.documentElement.style.setProperty('--cyan', pageColors[pageId]);

  // Apply body class
  document.body.className = document.body.className.replace(/page-\w+/g, '').trim();
  document.body.classList.add(`page-${pageId}`);

  // Close mobile nav
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('mobileNav')?.classList.remove('open');

  // Update URL hash
  history.pushState(null, null, '#' + pageId);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init map when contact tab is opened
  if (pageId === 'contact') {
    setTimeout(initContactMap, 150);
  }
}

// ===== NAV LINK CLICKS =====
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (link.dataset.page) showPage(link.dataset.page);
  });
});

// ===== LET'S TALK BUTTON =====
document.querySelector('.btn-talk')?.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('contact');
});

// ===== FOOTER LINKS =====
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

// ===== HANDLE URL HASH =====
function handleHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  showPage(hash);
}
handleHash();
window.addEventListener('popstate', handleHash);

// ===== THEME TOGGLE =====
let isDark = true;
document.getElementById('themeToggle')?.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  document.getElementById('themeToggle').textContent = isDark ? '☀' : '🌙';
  document.getElementById('navbar').style.background = isDark
    ? 'rgba(10,10,14,0.88)'
    : 'rgba(240,240,245,0.92)';
});

// ===== HAMBURGER =====
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileNav').classList.toggle('open');
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav?.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }
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

// ===== HOVER GLOW EFFECT =====
document.querySelectorAll('.card, .project-card, .story-card, .contact-channel-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
    card.style.setProperty('--glow-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });
});

// ===== STAT COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const startTime = performance.now();
  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
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

// ===== CONTACT MAP (Leaflet) =====
let contactMap = null;

function initContactMap() {
  const container = document.getElementById('contact-map');
  if (!container) return;
  if (contactMap) {
    contactMap.invalidateSize();
    return;
  }

  contactMap = L.map('contact-map', {
    center: [20, 30],
    zoom: 1,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 4
  }).addTo(contactMap);

  const pinIcon = L.divIcon({
    className: '',
    html: `<div class="map-pin-wrap"><span class="map-pin-pulse"></span><span class="map-pin-dot"></span></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  // const locations = [
  //   { latlng: [15.4909, 73.8278], label: 'India ★' },
  //   { latlng: [25.2048, 45.0000], label: 'Middle East' },
  //   { latlng: [51.5074, -0.1278], label: 'UK' },
  //   { latlng: [37.0902, -95.7129], label: 'N. America' },
  // ];

  // locations.forEach(loc => {
  //   L.marker(loc.latlng, { icon: pinIcon })
  //     .addTo(contactMap)
  //     .bindTooltip(loc.label, {
  //       permanent: true,
  //       direction: 'top',
  //       className: 'map-tooltip',
  //       offset: [0, -10]
  //     });
  // });
  const locations = [
    { latlng: [15.4909, 93.8278], label: 'India ★',   tooltipClass: 'map-tooltip map-tooltip-india' },
    { latlng: [25.2048, 45.0000], label: 'Middle East', tooltipClass: 'map-tooltip map-tooltip-middle-east' },
    { latlng: [51.5074, -0.1278], label: 'UK',          tooltipClass: 'map-tooltip map-tooltip-uk' },
    { latlng: [37.0902, -95.7129], label: 'N. America', tooltipClass: 'map-tooltip map-tooltip-america' },
  ];

  locations.forEach(loc => {
    L.marker(loc.latlng, { icon: pinIcon })
      .addTo(contactMap)
      .bindTooltip(loc.label, {
        permanent: true,
        direction: 'top',
        className: loc.tooltipClass,
        offset: [0, -10]
      });
  });

  // Critical: recalculate size after tiles load
  setTimeout(() => contactMap.invalidateSize(), 200);
}
  let worldMap = null;
  
  function initMap() {
    const mapDiv = document.getElementById('contact-map');
    if (!mapDiv) return;
    if (worldMap) { 
      worldMap.invalidateSize(); 
      return;
    }
    
    // Create map centered on world view
    worldMap = L.map('contact-map').setView([20.5937, 78.9629], 2);
    
    // RELIABLE MAP TILES (OpenStreetMap - always works)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 6,
      className: 'map-tiles'
    }).addTo(worldMap);
    
    // Custom glowing marker icon
    const customIcon = L.divIcon({
      html: '<div style="background: #00d4ff; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 14px #00d4ff, 0 0 4px white; border: 2px solid white;"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    
    // Country locations with tooltip labels
    const locations = [
      { latlng: [20.5937, 78.9629], label: '🇮🇳 INDIA' },
      { latlng: [25.2048, 45.0000], label: '🇦🇪 MIDDLE EAST' },
      { latlng: [55.3781, -3.4360], label: '🇬🇧 UNITED KINGDOM' },
      { latlng: [39.8283, -98.5795], label: '🇺🇸 NORTH AMERICA' }
    ];
    
    locations.forEach(loc => {
      const marker = L.marker(loc.latlng, { icon: customIcon }).addTo(worldMap);
      
      // PERMANENT VISIBLE TOOLTIP
      marker.bindTooltip(loc.label, {
        permanent: true,
        direction: 'top',
        offset: [0, -12],
        className: 'custom-map-label'
      }).openTooltip();
    });
    
    // Optional: Add subtle highlight circles around regions
    L.circle([20.5937, 78.9629], { color: '#00d4ff', weight: 1, opacity: 0.3, fillOpacity: 0.05, radius: 700000 }).addTo(worldMap);
    L.circle([25.2048, 45.0000], { color: '#00d4ff', weight: 1, opacity: 0.3, fillOpacity: 0.05, radius: 1000000 }).addTo(worldMap);
    L.circle([55.3781, -3.4360], { color: '#00d4ff', weight: 1, opacity: 0.3, fillOpacity: 0.05, radius: 400000 }).addTo(worldMap);
    L.circle([39.8283, -98.5795], { color: '#00d4ff', weight: 1, opacity: 0.3, fillOpacity: 0.05, radius: 1200000 }).addTo(worldMap);
    
    // Fix map size after load
    setTimeout(() => worldMap.invalidateSize(), 200);
  }
  
  // Initialize map when page loads
  window.addEventListener('load', initMap);
  window.addEventListener('resize', () => { if (worldMap) worldMap.invalidateSize(); });

 function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  document.getElementById('liveClock').innerHTML = `🕒 ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock(); // run once immediately



  function initMap() {
    const mapDiv = document.getElementById('contact-map');
    if (!mapDiv) return;
    if (worldMap) { worldMap.invalidateSize(); return; }
    worldMap = L.map('contact-map').setView([20.5937, 78.9629], 2.2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 6
    }).addTo(worldMap);
    const pinIcon = L.divIcon({
      html: '<div style="background:#00d4ff; width:12px; height:12px; border-radius:50%; box-shadow:0 0 10px #00d4ff; border:2px solid white;"></div>',
      iconSize: [12,12], iconAnchor: [6,6]
    });
    const locations = [
      { latlng: [20.5937, 78.9629], label: '🇮🇳 INDIA', offset: [0, -14] },
      { latlng: [25.2048, 45.0000], label: '🇦🇪 MIDDLE EAST', offset: [0, -14] },
      { latlng: [55.3781, -3.4360], label: '🇬🇧 UK', offset: [0, -14] },
      { latlng: [39.8283, -98.5795], label: '🇺🇸 N. AMERICA', offset: [0, -14] }
    ];
    locations.forEach(loc => {
      L.marker(loc.latlng, { icon: pinIcon }).addTo(worldMap)
        .bindTooltip(loc.label, { permanent: true, direction: 'top', offset: loc.offset, className: 'visible-map-label' });
    });
    setTimeout(() => worldMap.invalidateSize(), 200);
  }
  function scrollToContact() { document.querySelector('.contact-duo')?.scrollIntoView({ behavior: 'smooth' }); }
  window.addEventListener('load', initMap);
  window.addEventListener('resize', () => worldMap?.invalidateSize());

  async function saveContact() {
    const response = await fetch(CURRENT_DOMAIN + '/api/save-contact.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: 'Yaser Shaikh',
        email: 'yaser@example.com',
        message: 'Hello from portfolio!'
      })
    });

    const result = await response.json();
    console.log(result);
}


 
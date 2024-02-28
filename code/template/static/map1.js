// Initialize the map
let map1 = L.map('map1').setView([31.9686, -99.9018], 6);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map1);

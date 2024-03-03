// Initialize the map
let map3 = L.map('map3').setView([31.995845, -103.817762], 7.5);   // originally: [31.9686, -99.9018], centered on Midland/Odessa: [31.934074, -102.251176], centered on the corner of TX panhandle/wing: [32.003391, -103.061355]

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map3);

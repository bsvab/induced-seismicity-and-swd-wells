// Initialize the map
let map2 = L.map('map2').setView([32.003391, -103.061355], 7.5);   // originally: [31.9686, -99.9018], centered on Midland/Odessa: [31.934074, -102.251176]

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map2);

// // Add timeline slider
// let timelineControl = L.timelineSliderControl({
//     formatOutput: function (date) {
//         return new Date(date).toDateString();
//     }
// });

// timelineControl.addTo(map2);

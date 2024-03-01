// Initialize the map
let map2 = L.map('map2').setView([31.9686, -99.9018], 6);

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
// 2timelineControl.addTo(map2);

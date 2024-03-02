// Initialize the map
let map1 = L.map('map1').setView([31.9686, -99.9018], 7);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map1);

// Add timeline slider
let timelineControl = L.timelineSliderControl({
    formatOutput: function (date) {
        return new Date(date).toDateString();
    }
});

timelineControl.addTo(map1);

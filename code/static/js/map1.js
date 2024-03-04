// Initialize the map
let map1 = L.map('map1').setView([31.995845, -103.817762], 8);

// Define OpenStreetMap tiles
let osmTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

// Define Topographic map tiles (using OpenTopoMap here)
let topoTiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

// Add OpenStreetMap tiles to the map by default
osmTiles.addTo(map1);

// Define an object with all basemaps you want to offer
let baseMaps = {
    "OpenStreetMap": osmTiles,
    "Topographic": topoTiles
};

// Placeholder for overlay layers
let overlayMaps = {};

// Function to add overlay layers dynamically
function addOverlayLayers(injectionLayer, earthquakeLayer) {
    overlayMaps["Injection Data"] = injectionLayer;
    overlayMaps["Earthquake Data"] = earthquakeLayer;

    // Update or create the layer control
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map1);
}

// Add a layer control to the map, allowing the user to switch between basemaps
//L.control.layers(baseMaps).addTo(map1);

// Add timeline slider
//let timelineControl = L.timelineSliderControl({
    //formatOutput: function (date) {
        //return new Date(date).toDateString();
    //}
//});

//timelineControl.addTo(map1);

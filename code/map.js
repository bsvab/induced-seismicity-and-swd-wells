// Initialize the map
var map = L.map('map').setView([31.9686, -99.9018], 6);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to update the sidebar with currently displayed injections
function updateList(timeline) {
    var displayed = timeline.getLayers();
    var list = document.getElementById("displayed-list");
    list.innerHTML = ""; // Clear existing list
    
    displayed.forEach(function (featureLayer) {
        var feature = featureLayer.feature;
        var properties = feature.properties;
    
        var li = document.createElement("li");
        li.innerHTML = "<strong>API Number:</strong> " + properties["API Number"] +
                       "<br><strong>County:</strong> " + properties.County +
                       "<br><strong>Field Name:</strong> " + (properties["Field Name"] || "Unavailable") +
                       "<br><strong>Injection Date:</strong> " + properties["Injection Date"] +
                       "<br><strong>Injection End Date:</strong> " + properties["Injection End Date"] +
                       "<br><strong>Injection Layer:</strong> " + properties["Injection Layer"] +
                       "<br><strong>Volume Injected (BBLs):</strong> " + properties["Volume Injected (BBLs)"];
        
        list.appendChild(li);
    });
}

// Load GeoJSON data and create a timeline
fetch('../data/injection_data_v2.geojson')
    .then(response => response.json())
    .then(data => {
        var getInterval = function (feature) {
            var startTime = new Date(feature.properties["Injection Date"]).getTime();
            var endTime = new Date(feature.properties["Injection End Date"]).getTime();
            return { start: startTime, end: endTime };
        };

        var timeline = L.timeline(data, {
            getInterval: getInterval,
            pointToLayer: function (feature, latlng) {
                var volume = feature.properties["Volume Injected (BBLs)"];
                var radius = Math.max(3, Math.sqrt(volume) / 20); 
                return L.circleMarker(latlng, { radius: radius }).bindPopup(`Volume Injected: ${volume} BBLs`);
            }
        });

        var timelineControl = L.timelineSliderControl({
            formatOutput: function (date) {
                return new Date(date).toDateString();
            }
        });

        timelineControl.addTo(map);
        timelineControl.addTimelines(timeline);
        timeline.addTo(map);

        timeline.on('change', function () {
            updateList(timeline);
        });
    });

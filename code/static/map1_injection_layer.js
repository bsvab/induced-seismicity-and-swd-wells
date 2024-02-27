// Function to update the sidebar with currently displayed injections
function updateList(timeline) {
    let displayed = timeline.getLayers();
    let list = document.getElementById("displayed-list");
    list.innerHTML = ""; // Clear existing list
    
    displayed.forEach(function (featureLayer) {
        let feature = featureLayer.feature;
        let properties = feature.properties;
    
        let li = document.createElement("li");
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
        let getInterval = function (feature) {
            let startTime = new Date(feature.properties["Injection Date"]).getTime();
            let endTime = new Date(feature.properties["Injection End Date"]).getTime();
            return { start: startTime, end: endTime };
        };

        let timeline = L.timeline(data, {
            getInterval: getInterval,
            pointToLayer: function (feature, latlng) {
                let volume = feature.properties["Volume Injected (BBLs)"];
                let radius = Math.max(3, Math.sqrt(volume) / 20); 
                return L.circleMarker(latlng, { radius: radius }).bindPopup(`Volume Injected: ${volume} BBLs`);
            }
        });

        let timelineControl = L.timelineSliderControl({
            formatOutput: function (date) {
                return new Date(date).toDateString();
            }
        });

        timelineControl.addTo(map1);
        timelineControl.addTimelines(timeline);
        timeline.addTo(map1);

        timeline.on('change', function () {
            updateList(timeline);
        });
    });

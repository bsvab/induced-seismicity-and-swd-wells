// Load GeoJSON data and create a timeline
async function fetchDataFromFlask() {
    const response = await fetch('/injection_data');
    const data = await response.json();
    return data;
}

// Call the function to fetch data from Flask
fetchDataFromFlask()
    .then(response => response.json)
    .then(data => {
        let getInterval = function (feature) {
            // Use the exact property names from your GeoJSON
            let startTime = new Date(feature.properties["Injection Date"]).getTime();
            let endTime = new Date(feature.properties["Injection End Date"]).getTime();
            return { start: startTime, end: endTime };
        };

        let timeline = L.timeline(data, {
            getInterval: getInterval,
            pointToLayer: function (feature, latlng) {
                // Use the exact property names from your GeoJSON
                let volume = feature.properties["Volume Injected (BBLs)"];
                let radius = Math.max(3, Math.sqrt(volume) / 20); // Adjust the calculation as needed
                // Construct the popup content string
                let popupContent = `API Number: ${feature.properties["API Number"]}<br>` +
                                   `Volume Injected: ${volume} BBLs<br>` +
                                   `County: ${feature.properties["County"]}<br>` +
                                   `Field Name: ${feature.properties["Field Name"]}<br>` +
                                   `Injection Layer: ${feature.properties["Injection Layer"]}`;
                return L.circleMarker(latlng, { radius: radius }).bindPopup(popupContent);
            }
        });

        // MOVED BELOW CODE TO MAP1.JS FILE - DO NOT UNCOMMENT
        // let timelineControl = L.timelineSliderControl({
        //     formatOutput: function (date) {
        //         return new Date(date).toDateString();
        //     }
        // });

        // timelineControl.addTo(map1);
        // MOVED ABOVE CODE TO MAP1.JS FILE - DO NOT UNCOMMENT

        timelineControl.addTimelines(timeline);
        timeline.addTo(map1);

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
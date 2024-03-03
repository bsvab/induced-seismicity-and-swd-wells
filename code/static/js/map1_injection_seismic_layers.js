// Function to fetch data from the server
async function fetchDataFromFlask(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; // Ensure this is a valid GeoJSON object
    } catch (error) {
        console.error('Error fetching data:', error);
        
    }
}

// Function to create a timeline layer from GeoJSON data
function createTimelineLayer(data, getIntervalFunction, pointToLayerFunction) {
    return L.timeline(data, {
        getInterval: getIntervalFunction,
        pointToLayer: pointToLayerFunction,
    });
}

// Function to adjust date to the first day of its month
function adjustDateToFirstOfMonth(dateString) {
    let date = new Date(dateString);
    date.setDate(1); // Set to the first day of the month
    return date;
}


// Function to initialize and add the timeline layers to the map
async function initTimelineLayers() {
    const injectionData = await fetchDataFromFlask('/injection_data');
    const earthquakeData = await fetchDataFromFlask('/earthquake_data');
    console.log(injectionData);
    console.log(earthquakeData);
    // Preprocess earthquake data to adjust types and formats
    earthquakeData.features.forEach(feature => {
        // Convert date string to Date object in the desired format
        let date = new Date(feature.properties["event_date"]);
        let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        feature.properties["event_date"] = formattedDate;

        // Convert latitude, longitude, and magnitude from string to float
        feature.geometry.coordinates = [parseFloat(feature.geometry.coordinates[0]), parseFloat(feature.geometry.coordinates[1])];
        feature.properties["Magnitude"] = parseFloat(feature.properties["magnitude"]);
    });
    // Function to get intervals for features, adjusted to the first day of the month
    let getInterval = function (feature) {
        let constrainedStartDate = new Date('2017-01-01').getTime();
    
        let featureStartDate = adjustDateToFirstOfMonth(feature.properties["Injection Date"] || feature.properties["event_date"]).getTime();
        let featureEndDate = adjustDateToFirstOfMonth(feature.properties["Injection End Date"] || feature.properties["event_date"]).getTime();
        
        // If the feature start date is before the constrained start date, use the constrained start date
        let startTime = Math.max(constrainedStartDate, featureStartDate);
        let endTime = featureEndDate;
        // For earthquake, set start and end the same since it's a single-day event
        if (feature.properties["event_date"]) {
            endTime = startTime; // Earthquake happens on a single day
        }
        return { start: startTime, end: endTime };
    };

    // Function to determine earthquake circle size based on magnitude
    function earthquakeCircleSize(magnitude) {
        if (magnitude < 2) return 4; // Very small circle for magnitude < 2
        else if (magnitude < 3) return 8; // Small circle for magnitude 2-3
        else if (magnitude < 4) return 12; // Medium circle for magnitude 3-4
        else if (magnitude < 5) return 16; // Large circle for magnitude 4-5
        else return 20; // Very large circle for magnitude > 5
    }
    

    // Define pointToLayer function for injection data
    let pointToLayerInjection = function (feature, latlng) {
        let volume = feature.properties["Volume Injected (BBLs)"];
        let maxVolume = 700000; 
        let normalizedVolume = volume / maxVolume;
        let radius = Math.max(3, Math.sqrt(normalizedVolume) * 20); // Normalize the volume to the range 
        let popupContent = `API Number: ${feature.properties["API Number"]}<br>` +
                           `Volume Injected: ${volume} BBLs<br>`;
        return L.circleMarker(latlng, {
        radius: radius,
        color: '#3388ff', // Blue color for injection data
        fillColor: '#3388ff',
        fillOpacity: 0.35,
        weight:0.4
    }).bindPopup(popupContent);
    };

    // Define pointToLayer function for earthquake data
    let pointToLayerEarthquake = function (feature, latlng) {
        console.log("Earthquake feature:", feature); // Debugging line
        let magnitude = feature.properties["Magnitude"];
        let radius = earthquakeCircleSize(magnitude);
        let event_date = feature.properties["event_date"];
        let popupContent = `Magnitude: ${magnitude}<br>`+
                            `Event Date:${event_date}</br>`;
        return L.circleMarker(latlng, {
        radius: radius,
        color: '#d53e4f', // Red color for earthquake data
        fillColor: '#d53e4f',
        fillOpacity: 0.35,
        weight:0.4
    }).bindPopup(popupContent);
    };

    // Create timeline layers
    const injectionLayer = createTimelineLayer(injectionData, getInterval, pointToLayerInjection);
    const earthquakeLayer = createTimelineLayer(earthquakeData, getInterval, pointToLayerEarthquake);

    addOverlayLayers(injectionLayer, earthquakeLayer);


    // Create timeline control and add it to the map
    const timelineControl = L.timelineSliderControl({
        formatOutput: date => new Date(date).toDateString(),
        start: new Date('2017-01-01').getTime() 
    });
    timelineControl.addTo(map1);
    timelineControl.addTimelines(injectionLayer, earthquakeLayer);

    injectionLayer.addTo(map1);
    earthquakeLayer.addTo(map1);
}

// Initialize the timeline layers
initTimelineLayers();
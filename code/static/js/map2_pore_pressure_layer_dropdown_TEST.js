// Create and load pore pressure layer to map2 for Layer 13

let timeline_pressure_13; // Define timeline_pressure_13 variable

// Function to fetch data from Flask route
async function fetchDataFromFlask() {
    try{
        const response = await fetch('/pressure_data_13');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

// Call the function to fetch data from Flask
fetchDataFromFlask()
    .then(dataset => {
        // Now you have the dataset, you can use it here
        console.log('Pressure data:', dataset);
        drawMapSquares(dataset);

        // Populate dropdown and initialize selection
        populateDropdown();
        initSelection();

        // Call the function to render squares for the most recent date initially
        renderSquares(document.getElementById('dateDropdownContainer').value);
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// ------------------------------------------------------------------------------------------------------------------------------------------------
// SQUARES
// ------------------------------------------------------------------------------------------------------------------------------------------------

// Define the bounds of Texas
let texasBounds = L.latLngBounds(
    [25.8371, -106.6466], // Southwest coordinates of Texas
    [36.5007, -93.5083]  // Northeast coordinates of Texas
);

// Define a variable to accumulate all pressure delta values for all squares
let squarePressureDeltas = {};

// Function to draw map squares based on pressure data
function drawMapSquares(geojson) {
    // Calculate the number of squares needed
    let width = texasBounds.getEast() - texasBounds.getWest();
    let height = texasBounds.getNorth() - texasBounds.getSouth();

    // Calculate number of squares horizontally and vertically
    let numHorizontalSquares = Math.ceil(width / (5 / 69)); // 1 degree latitude is approximately 69 miles
    let numVerticalSquares = Math.ceil(height / (5 / 69));

    // Calculate the dimensions of each square
    let squareWidth = width / numHorizontalSquares;
    let squareHeight = height / numVerticalSquares;

    // Iterate over each data point and assign pressure delta to the corresponding square
    geojson.features.forEach(feature => {
        // Extract necessary properties
        const lat = Number(feature.geometry.coordinates[1]);
        const lng = Number(feature.geometry.coordinates[0]);
        const delta = Number(feature.properties["Pressure Delta"]);

        // Calculate the square index for the data point
        let xIndex = Math.floor((lng - texasBounds.getWest()) / squareWidth);
        let yIndex = Math.floor((texasBounds.getNorth() - lat) / squareHeight);
        // Create a unique key for the square
        let key = xIndex + '_' + yIndex;
        // Initialize array for the square if not exists
        if (!squarePressureDeltas[key]) {
            squarePressureDeltas[key] = [];
        }
        // Add the pressure delta to the square
        squarePressureDeltas[key].push(delta);
    });
}

// ------------------------------------------------------------------------------------------------------------------------------------------------
// DROPDOWN
// ------------------------------------------------------------------------------------------------------------------------------------------------

// Dropdown element
let dropdown = L.control({position: 'topright'});

// Function to populate the dropdown with available month/year dates
function populateDropdown() {
    console.log("Populating dropdown...");
    let dropdownContent = '<select id="dateDropdownContainer">';
    
    // Assuming timeline_pressure_13 is available and contains data
    console.log("Timeline data:", timeline_pressure_13);
    const uniqueDates = new Set(); // Set to store unique dates
    timeline_pressure_13.features.forEach(feature => {
        // console.log('Processing feature:', feature);
        let date = new Date(feature.properties.date);
        let year = date.getUTCFullYear();
        let month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Adding 1 to month to make it 1-based
        let formattedDate = `${year}-${month}-01`;
        uniqueDates.add(formattedDate); // Add formatted date to the set
    });

    // Convert set to array and sort it
    const sortedDates = [...uniqueDates].sort();

    // Generate dropdown options
    sortedDates.forEach(date => {
        dropdownContent += `<option value="${date}">${date}</option>`;
    });
    
    dropdownContent += '</select>';
    
    // console.log("Dropdown content:", dropdownContent);

    // Update dropdown element on the map with the generated content
    document.getElementById('dateDropdownContainer').innerHTML = dropdownContent;
    
    return dropdownContent;
}

dropdown.onAdd = function (map2) {
    let div = L.DomUtil.create('div', 'dropdown');
    div.innerHTML = populateDropdown(); // Populate dropdown content

    // Event listener for dropdown change
    div.querySelector('select').addEventListener('change', function(e) {
        console.log('Dropdown value changed:', e.target.value);
        let selectedDate = e.target.value;
        renderSquares(selectedDate);
    });

    return div;
};

dropdown.addTo(map2);

// Function to render squares for the selected month/year
function renderSquares(selectedDate) {
    // Prepare GeoJSON object for chloropleth layer
    let chloroplethGeoJSON = {
        type: "FeatureCollection",
        features: []
    };

    // Iterate over the pressure deltas for each square
    Object.keys(squarePressureDeltas).forEach(key => {
        let deltas = squarePressureDeltas[key];
        let [xIndex, yIndex] = key.split('_').map(Number);
        let lat = texasBounds.getNorth() - (yIndex * (5 / 69)); // Reverse calculation
        let lng = texasBounds.getWest() + (xIndex * (5 / 69));
        let averageDelta = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;

        // Assign color based on average delta value
        const color = getColor(averageDelta);

        // Create polygon geometry for square
        const squarePolygon = [
            [lat, lng],                       // Top-left
            [lat + (5 / 69), lng],           // Top-right
            [lat + (5 / 69), lng + (5 / 69)], // Bottom-right
            [lat, lng + (5 / 69)],          // Bottom-left
            [lat, lng]                       // Top-left (closing the polygon)
        ];

        // Add the square feature to chloroplethGeoJSON
        chloroplethGeoJSON.features.push({
            type: "Feature",
            properties: {
                pressure_delta: averageDelta,
                color: color
            },
            geometry: {
                type: "Polygon",
                coordinates: [squarePolygon]
            }
        });
    });

    // Remove existing chloropleth layer if any
    if (chloroplethLayer) {
        map2.removeLayer(chloroplethLayer);
    }

    // Render the chloropleth layer on the map
    chloroplethLayer = L.geoJSON(chloroplethGeoJSON, {
        style: function(feature) {
            return {
                fillColor: feature.properties.color,
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }
    }).addTo(map2);
}

// Function to initialize the selection with the most recent date
function initSelection() {
    document.getElementById('dateDropdownContainer').value = '2024-01-01';
}

// ------------------------------------------------------------------------------------------------------------------------------------------------
// LEGEND
// ------------------------------------------------------------------------------------------------------------------------------------------------

// create legend & add to map
let legend = L.control({position: 'topright'});

legend.onAdd = function (map2) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        labels = [];

    // Add title to the legend
    div.innerHTML = '<p><ins>Pore Pressure Delta</ins></p>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i].toLocaleString() + (grades[i + 1] ? ' &ndash; ' + grades[i + 1].toLocaleString() + '<br>' : ' +');
    }

    return div;
};

legend.addTo(map2);

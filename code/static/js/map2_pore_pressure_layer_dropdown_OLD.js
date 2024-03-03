// Create and load pore pressure layer to map2 for Layer 13

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

// Function to calculate color based on value
function getColor(value) {
    return value >= 1000 ? '#33000F' :
           value >= 900  ? '#4C0016' :
           value >= 800  ? '#800026' :
           value >= 700  ? '#bd0026' :
           value >= 600  ? '#e31a1c' :
           value >= 500  ? '#fc4e2a' :
           value >= 400  ? '#fd8d3c' :
           value >= 300  ? '#feb24c' :
           value >= 200  ? '#fed976' :
           value >= 100  ? '#ffeda0' :
                           '#ffffcc' ;
}

// Define a variable to accumulate all timeline data for all squares
let timeline_pressure_13 = {
    type: "FeatureCollection",
    features: []
};

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

    // Create a dictionary to store data points for each square
    let squareData = {};

    // Iterate over each data point and assign it to the corresponding square
    geojson.features.forEach(feature => {
        // Extract necessary properties
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        // console.log('Lat:', lat, 'Lng:', lng);
        const layer = feature.properties.Layer;
        const delta = feature.properties["Pressure Delta"];
        const date = new Date(feature.properties.Date);
        
        // Calculate the square index for the data point
        let xIndex = Math.floor((lng - texasBounds.getWest()) / squareWidth);
        let yIndex = Math.floor((texasBounds.getNorth() - lat) / squareHeight);
        // Create a unique key for the square
        let key = xIndex + '_' + yIndex;
        // Initialize array for the square if not exists
        if (!squareData[key]) {
            squareData[key] = [];
        }
        // Add the data point to the square
        squareData[key].push({ delta, date, lat, lng });
    });

    // Iterate over each square and generate timeline dataset
    Object.keys(squareData).forEach(key => {
        let points = squareData[key];
        timelineDataset = generateSquareTimeline(points, squareWidth, squareHeight);
        // console.log('Timeline dataset for square', key, ':', timelineDataset);
        // Concatenate this square's timeline dataset to the overall timeline dataset
        timeline_pressure_13.features = timeline_pressure_13.features.concat(timelineDataset.features);
    });
    // Now you can use the combined timeline dataset for all squares
    console.log('Combined timeline dataset for all squares:', timeline_pressure_13);
}

// Function to generate timeline dataset for each square
function generateSquareTimeline(points, squareWidth, squareHeight) {
    // Group data points by month/year
    const groupedByMonthYear = points.reduce((acc, { delta, date }) => {
        const parse_date = new Date(date)
        const year = parse_date.getUTCFullYear();
        const month = parse_date.getUTCMonth();
        const monthString = String(month).padStart(2, '0'); // Ensure month has 2 digits
        const key = `${year}-${monthString}`;
        if (!acc[key]) {
            acc[key] = { deltas: [], date: new Date(Date.UTC(year, month)) };
        }
        acc[key].deltas.push(Number(delta));
        return acc;
    }, {});

    // Initialize timeline dataset
    const timelineDataset = {
        type: "FeatureCollection",
        features: []
    };

    // Iterate over each month/year
    Object.keys(groupedByMonthYear).forEach(key => {
        const { deltas, date } = groupedByMonthYear[key];
        const averageDelta = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // Adding 1 to month to make it 1-based
        const monthString = String(month).padStart(2, '0'); // Ensure month has 2 digits

        // Assign color based on average delta value
        const color = getColor(averageDelta);

        // Get square coordinates
        const squareCoordinates = points[0]; // Assuming all points have same coordinates within the square
        const lat = squareCoordinates.lat;
        const lng = squareCoordinates.lng;
        // console.log('var lat:', squareCoordinates.lat);
        // console.log('var lng:', squareCoordinates.lng);

        // Calculate the coordinates of the top-right and bottom-right corners
        const topRightLat = Number(lat) + Number(squareHeight);
        const topRightLng = Number(lng);
        const bottomRightLat = Number(lat) + Number(squareHeight);
        const bottomRightLng = Number(lng) + Number(squareWidth);
        const bottomLeftLng = Number(lng) + Number(squareWidth);

        // Create polygon geometry for square
        const squarePolygon = [
            [Number(lat), Number(lng)],       // Top-left
            [topRightLat, topRightLng],       // Top-right
            [bottomRightLat, bottomRightLng], // Bottom-right
            [Number(lat), bottomLeftLng]     // Bottom-left
            //[Number(lat), Number(lng)]        // Top-left (closing the polygon)
        ];
        // console.log('Square polygon:', squarePolygon);

        // Add the data point to the timeline dataset
        timelineDataset.features.push({
            type: "Feature",
            properties: {
                date: `${year}-${monthString}-01`, // Adding 1 to month to make it 1-based
                layer: "Layer_13",
                pressure_delta: averageDelta, 
                color: color // Assign color based on average delta value
            },
            geometry: {
                type: "Polygon",
                coordinates: [squarePolygon] // Update with square polygon coordinates
            }
        });
    });

    return timelineDataset;
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
    // Filter timeline dataset to get squares for the selected month/year
    let filteredSquares = timeline_pressure_13.features.filter(feature => {
        return feature.properties.date === selectedDate;
    });

    // Iterate over existing layers and remove only those representing squares
    map2.eachLayer(layer => {
        // Check if the layer represents a square
        if (layer instanceof L.GeoJSON && layer.options && layer.options.className === 'squareLayer') {
            map2.removeLayer(layer);
        }
    });

    // Add squares to the map for the selected month/year
    filteredSquares.forEach(square => {
        L.geoJSON(square.geometry, { className: 'squareLayer' }).addTo(map2);
    });
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

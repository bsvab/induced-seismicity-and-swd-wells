// Create and load pore pressure layer to map2 for Layer 13

// Function to fetch data from Flask route
async function fetchDataFromFlask() {
    const response = await fetch('/pressure_data');
    const data = await response.json();
    return data;
}

// Call the function to fetch data from Flask
fetchDataFromFlask()
    .then(dataset => {
        // Now you have the dataset, you can use it here
        console.log('Fetched dataset:', dataset);
        drawMapSquares(dataset);
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
    return value >= 10000 ? '#33000F' :
           value >= 9000  ? '#4C0016' :
           value >= 8000  ? '#800026' :
           value >= 7000  ? '#bd0026' :
           value >= 6000  ? '#e31a1c' :
           value >= 5000  ? '#fc4e2a' :
           value >= 4000  ? '#fd8d3c' :
           value >= 3000  ? '#feb24c' :
           value >= 2000  ? '#fed976' :
           value >= 1000  ? '#ffeda0' :
                            '#ffffcc' ;
}

// Function to draw 5 square mile map squares based on the dataset
function drawMapSquares(dataset) {
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
    dataset.forEach(point => {
        // Filter data points for 'Layer_13'
        if (point.layer === 'Layer_13') {
            // Calculate the square index for the data point
            let xIndex = Math.floor((point.lng - texasBounds.getWest()) / squareWidth);
            let yIndex = Math.floor((texasBounds.getNorth() - point.lat) / squareHeight);
            // Create a unique key for the square
            let key = xIndex + '_' + yIndex;
            // Initialize array for the square if not exists
            if (!squareData[key]) {
                squareData[key] = [];
            }
            // Add the data point to the square
            squareData[key].push(point);
        }
    });

    // Initialize timeline dataset as a GeoJSON FeatureCollection
    const timelineDataset = {
        type: "FeatureCollection",
        features: []
    };

    // Iterate over each square and generate timeline dataset
    Object.keys(squareData).forEach(key => {
        let points = squareData[key];

        // Get the minimum and maximum years from the dataset
        const minYear = Math.min(...points.map(dataPoint => dataPoint.date.getFullYear()));
        const maxYear = Math.max(...points.map(dataPoint => dataPoint.date.getFullYear()));

        // Create a feature for each square
        const squareFeature = {
            type: "Feature",
            properties: {
                squareKey: key,
                pressures: [] // Array to store pressure values for different dates
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    // Define coordinates of the square here
                ]
            }
        };

        // Iterate over each year
        for (let year = minYear; year <= maxYear; year++) {
            // Iterate over each month
            for (let month = 0; month < 12; month++) { // 0 represents January, 11 represents December
                // Find the latest data point within the month
                const latestDataPoint = points.filter(dataPoint => {
                    const date = dataPoint.date;
                    return date.getFullYear() === year && date.getMonth() === month;
                }).sort((a, b) => b.date - a.date)[0]; // Sort descending and get the first (latest) element

                // Add the latest data point to the timeline dataset
                if (latestDataPoint) {
                    squareFeature.properties.pressures.push({
                        layer: latestDataPoint.layer,
                        year,
                        month: month + 1, // Adding 1 to make it 1-based month
                        date: new Date(year, month, 1),
                        value: latestDataPoint.value
                    });
                }
            }
        }

        // Add square feature to the timeline dataset
        timelineDataset.features.push(squareFeature);
    });

    console.log('Timeline dataset:', timelineDataset);

    // Initialize Leaflet timeline control
    let timelineControl = L.timelineSliderControl({
        formatOutput: function (date) {
            return new Date(date).toDateString();
        }
    });

    // Add timeline control to the map
    timelineControl.addTo(map2);

    // Add timeline dataset to the timeline control
    timelineControl.addTimelines(timelineDataset);

    // Add timeline to the map
    let timeline = L.timeline(timelineDataset, {
        style: function (data) {
            return { fillColor: getColor(data.value), color: '#000', fillOpacity: 0.5 };
        }
    }).addTo(map2);

}

// ------------------------------------------------------------------------------------------------------------------------------------------------
// LEGEND
// ------------------------------------------------------------------------------------------------------------------------------------------------

// create legend & add to map
let legend = L.control({position: 'topright'});

legend.onAdd = function (map2) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
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


// Create and load pore pressure layer to map2 for Layer 13

// // Function to fetch data from Flask route
// async function fetchDataFromFlask() {
//     const response = await fetch('/pressure_data_13');
//     const data = await response.json();
//     return data;
// }

// // Call the function to fetch data from Flask
// fetchDataFromFlask()
//     .then(dataset => {
//         // Now you have the dataset, you can use it here
//         console.log('Fetched dataset:', dataset);
//         drawMapSquares(dataset);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

// Call the function to read pressure data from Flask endpoint
fetch('/pressure_data_13')
    .then(response => response.json())
    .then(geojson => {
        console.log('Pressure data:', geojson);
        drawMapSquares(geojson);
    })
    .catch(error => {
        console.error('Error reading pressure data:', error);
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
        console.log('Timeline dataset for square', key, ':', timelineDataset);
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

        // Create polygon geometry for square
        const squarePolygon = [
            [lat, lng],                       // Top-left
            [lat + squareHeight, lng],        // Top-right
            [lat + squareHeight, lng + squareWidth],  // Bottom-right
            [lat, lng + squareWidth],         // Bottom-left
            [lat, lng]                        // Top-left (closing the polygon)
        ];

        // Add the data point to the timeline dataset
        timelineDataset.features.push({
            type: "Feature",
            properties: {
                start: `${year}-${monthString}-01`, // Adding 1 to month to make it 1-based
                end: `${year}-${monthString}-01`, // Same as start for monthly data
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

// Add timeline dataset to the timeline control
timelineControl.addTimelines(timeline_pressure_13);

// Add timeline to the map
let timeline = L.timeline(timeline_pressure_13, {
    style: function (data) {
        return { fillColor: getColor(data.value), color: '#000', fillOpacity: 0.5 };
    }
}).addTo(map2);


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

// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // ------------------------------------------------------------------------------------------------------------------------------------------------

// // Define the bounds of Texas
// let texasBounds = L.latLngBounds(
//     [25.8371, -106.6466], // Southwest coordinates of Texas
//     [36.5007, -93.5083]  // Northeast coordinates of Texas
// );

// // Create a Leaflet map centered on Texas
// let map = L.map('map').fitBounds(texasBounds);

// // Add OpenStreetMap tile layer
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Call the function to read pressure data from Flask endpoint
// fetch('/pressure_data_13')
//     .then(response => response.json())
//     .then(geojson => {
//         // Now you have the geojson data, you can use it here
//         console.log('Pressure data:', geojson);
//         drawMapSquares(geojson);
//     })
//     .catch(error => {
//         console.error('Error reading pressure data:', error);
//     });

// // Function to draw map squares based on pressure data
// function drawMapSquares(geojson) {
//     // Calculate the number of squares needed
//     let width = texasBounds.getEast() - texasBounds.getWest();
//     let height = texasBounds.getNorth() - texasBounds.getSouth();

//     // Calculate number of squares horizontally and vertically
//     let numHorizontalSquares = Math.ceil(width / (5 / 69)); // 1 degree latitude is approximately 69 miles
//     let numVerticalSquares = Math.ceil(height / (5 / 69));

//     // Calculate the dimensions of each square
//     let squareWidth = width / numHorizontalSquares;
//     let squareHeight = height / numVerticalSquares;

//     // Create a dictionary to store data points for each square
//     let squareData = {};

//     // Iterate over each data point and assign it to the corresponding square
//     geojson.features.forEach(feature => {
//         // Extract necessary properties
//         const lat = feature.geometry.coordinates[1];
//         const lng = feature.geometry.coordinates[0];
//         const layer = feature.properties.Layer;
//         const delta = feature.properties["Pressure Delta"];
//         const date = new Date(feature.properties.Date);
        
//         // Calculate the square index for the data point
//         let xIndex = Math.floor((lng - texasBounds.getWest()) / squareWidth);
//         let yIndex = Math.floor((texasBounds.getNorth() - lat) / squareHeight);
//         // Create a unique key for the square
//         let key = xIndex + '_' + yIndex;
//         // Initialize array for the square if not exists
//         if (!squareData[key]) {
//             squareData[key] = [];
//         }
//         // Add the data point to the square
//         squareData[key].push({ delta, date, lat, lng });
//     });

//     // Iterate over each square and generate timeline dataset
//     Object.keys(squareData).forEach(key => {
//         let points = squareData[key];
//         let timelineDataset = generateSquareTimeline(points);
//         console.log('Timeline dataset for square', key, ':', timelineDataset);
//         // Now you can use this timeline dataset for each square
//     });
// }

// // Function to generate timeline dataset for each square
// function generateSquareTimeline(points) {
//     // Group data points by month/year
//     const groupedByMonthYear = points.reduce((acc, { delta, date }) => {
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         const key = `${year}-${month}`;
//         if (!acc[key]) {
//             acc[key] = { deltas: [], date: date };
//         }
//         acc[key].deltas.push(delta);
//         return acc;
//     }, {});

//     // Initialize timeline dataset
//     const timelineDataset = {
//         type: "FeatureCollection",
//         features: []
//     };

//     // Iterate over each month/year
//     Object.keys(groupedByMonthYear).forEach(key => {
//         const { deltas, date } = groupedByMonthYear[key];
//         const averageDelta = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
//         const year = date.getFullYear();
//         const month = date.getMonth() + 1; // Adding 1 to month to make it 1-based

//         // Assign color based on average delta value
//         const color = getColor(averageDelta);

//         // Get square coordinates
//         const squareCoordinates = points[0]; // Assuming all points have same coordinates within the square

//         // Add the data point to the timeline dataset
//         timelineDataset.features.push({
//             type: "Feature",
//             properties: {
//                 start: `${year}-${month}-01`, // Adding 1 to month to make it 1-based
//                 end: `${year}-${month}-01`, // Same as start for monthly data
//                 Layer: "Layer_13", // Adjust as needed based on data structure
//                 "Pressure Delta": averageDelta, // Adjust as needed based on data structure
//                 color: color // Assign color based on average delta value
//             },
//             geometry: {
//                 type: "Point",
//                 coordinates: [squareCoordinates.lng, squareCoordinates.lat] // Update with square coordinates
//             }
//         });
//     });

//     return timelineDataset;
// }

// // Function to calculate color based on value
// function getColor(value) {
//     return value >= 1000 ? '#33000F' :
//            value >= 900  ? '#4C0016' :
//            value >= 800  ? '#800026' :
//            value >= 700  ? '#bd0026' :
//            value >= 600  ? '#e31a1c' :
//            value >= 500  ? '#fc4e2a' :
//            value >= 400  ? '#fd8d3c' :
//            value >= 300  ? '#feb24c' :
//            value >= 200  ? '#fed976' :
//            value >= 100  ? '#ffeda0' :
//                            '#ffffcc' ;
// };


// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // ------------------------------------------------------------------------------------------------------------------------------------------------


// // Create and load pore pressure layer to map2 for Layer 13

// // Function to fetch data from Flask route
// async function fetchDataFromFlask() {
//     const response = await fetch('/pressure_data_13');
//     const data = await response.json();
//     return data;
// }

// // Call the function to fetch data from Flask
// fetchDataFromFlask()
//     .then(dataset => {
//         // Now you have the dataset, you can use it here
//         console.log('Fetched dataset:', dataset);
//         drawMapSquares(dataset.features);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // SQUARES
// // ------------------------------------------------------------------------------------------------------------------------------------------------

// // Define the bounds of Texas
// let texasBounds = L.latLngBounds(
//     [25.8371, -106.6466], // Southwest coordinates of Texas
//     [36.5007, -93.5083]  // Northeast coordinates of Texas
// );

// // Function to calculate color based on value
// function getColor(value) {
//     return value >= 1000 ? '#33000F' :
//            value >= 900  ? '#4C0016' :
//            value >= 800  ? '#800026' :
//            value >= 700  ? '#bd0026' :
//            value >= 600  ? '#e31a1c' :
//            value >= 500  ? '#fc4e2a' :
//            value >= 400  ? '#fd8d3c' :
//            value >= 300  ? '#feb24c' :
//            value >= 200  ? '#fed976' :
//            value >= 100  ? '#ffeda0' :
//                            '#ffffcc' ;
// };

// // Function to draw 5 square mile map squares based on the dataset
// function drawMapSquares(features) {
//     // Calculate the number of squares needed
//     let width = texasBounds.getEast() - texasBounds.getWest();
//     let height = texasBounds.getNorth() - texasBounds.getSouth();

//     // Calculate number of squares horizontally and vertically
//     let numHorizontalSquares = Math.ceil(width / (5 / 69)); // 1 degree latitude is approximately 69 miles
//     let numVerticalSquares = Math.ceil(height / (5 / 69));

//     // Calculate the dimensions of each square
//     let squareWidth = width / numHorizontalSquares;
//     let squareHeight = height / numVerticalSquares;

//     // Create a dictionary to store data points for each square
//     let squareData = {};

//     // Iterate over each data point and assign it to the corresponding square
//     features.forEach(feature => {        
//         let point = feature.geometry.coordinates;
//         let properties = feature.properties;
//         // Calculate the square index for the data point
//         let xIndex = Math.floor((point.lng - texasBounds.getWest()) / squareWidth);
//         let yIndex = Math.floor((texasBounds.getNorth() - point.lat) / squareHeight);
//         // Create a unique key for the square
//         let key = xIndex + '_' + yIndex;
//         // Initialize array for the square if not exists
//         if (!squareData[key]) {
//             squareData[key] = [];
//         }
//         // Add the data point to the square
//         squareData[key].push(point);
//     });

//     // Initialize timeline dataset as a GeoJSON FeatureCollection
//     let timelineDataset = {
//         type: "FeatureCollection",
//         features: []
//     };

//     // Iterate over each square and generate timeline dataset
//     Object.keys(squareData).forEach(key => {
//         let points = squareData[key];

//         // Get the minimum and maximum years from the dataset
//         let minYear = Math.min(...points.map(dataPoint => dataPoint.date.getFullYear()));
//         let maxYear = Math.max(...points.map(dataPoint => dataPoint.date.getFullYear()));

//         // Create a feature for each square
//         let squareFeature = {
//             type: "Feature",
//             properties: {
//                 squareKey: key,
//                 pressures: [] // Array to store pressure values for different dates
//             },
//             geometry: {
//                 type: "Polygon",
//                 coordinates: [
//                     // Define coordinates of the square here
//                 ]
//             }
//         };

//         // Iterate over each year
//         for (let year = minYear; year <= maxYear; year++) {
//             // Iterate over each month
//             for (let month = 0; month < 12; month++) { // 0 represents January, 11 represents December
//                 // Find the latest data point within the month
//                 let latestDataPoint = points.filter(dataPoint => {
//                     let date = dataPoint.date;
//                     return date.getFullYear() === year && date.getMonth() === month;
//                 }).sort((a, b) => b.date - a.date)[0]; // Sort descending and get the first (latest) element

//                 // Add the latest data point to the timeline dataset
//                 if (latestDataPoint) {
//                     squareFeature.properties.pressures.push({
//                         layer: latestDataPoint.layer,
//                         year,
//                         month: month + 1, // Adding 1 to make it 1-based month
//                         date: new Date(year, month, 1),
//                         value: latestDataPoint.value
//                     });
//                 }
//             }
//         }

//         // Add square feature to the timeline dataset
//         timelineDataset.features.push(squareFeature);
//     });

//     console.log('Timeline dataset:', timelineDataset);

//     // Initialize Leaflet timeline control
//     let timelineControl = L.timelineSliderControl({
//         formatOutput: function (date) {
//             return new Date(date).toDateString();
//         }
//     });

//     // Add timeline control to the map
//     timelineControl.addTo(map2);

//     // Add timeline dataset to the timeline control
//     timelineControl.addTimelines(timelineDataset);

//     // Add timeline to the map
//     let timeline = L.timeline(timelineDataset, {
//         style: function (data) {
//             return { fillColor: getColor(data.value), color: '#000', fillOpacity: 0.5 };
//         }
//     }).addTo(map2);

// }

// // ------------------------------------------------------------------------------------------------------------------------------------------------
// // LEGEND
// // ------------------------------------------------------------------------------------------------------------------------------------------------

// // create legend & add to map
// let legend = L.control({position: 'topright'});

// legend.onAdd = function (map2) {

//     let div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
//         labels = [];

//     // Add title to the legend
//     div.innerHTML = '<p><ins>Pore Pressure Delta</ins></p>';

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (let i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i].toLocaleString() + (grades[i + 1] ? ' &ndash; ' + grades[i + 1].toLocaleString() + '<br>' : ' +');
//     }

//     return div;
// };

// legend.addTo(map2);


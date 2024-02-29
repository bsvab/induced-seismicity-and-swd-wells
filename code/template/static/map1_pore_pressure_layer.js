// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to parse CSV data
function parseCSV(csvData) {
    let dataset = [];
    // Split the CSV data into lines
    const lines = csvData.split('\n');
    // Iterate over each line
    lines.forEach(line => {
        // Split the line into comma-separated values
        const values = line.split(',');
        // Extract lat, lng, and value from the values array
        const lat = parseFloat(values[4]);
        const lng = parseFloat(values[3]);
        const value = parseFloat(values[1]);
        // Check if lat, lng, and value are valid numbers
        if (!isNaN(lat) && !isNaN(lng) && !isNaN(value)) {
            // Construct the data point object
            const dataPoint = { lat, lng, value };
            // Push the data point object to the dataset array
            dataset.push(dataPoint);
        }
    });
    return dataset;
}

// Function to read CSV file
async function readCSVFile(url) {
    const response = await fetch(url);
    const data = await response.text();
    return parseCSV(data);
}

// Call the function to read the CSV file
fetch('../../data/smaller_file_test_pressure_data.csv')
    .then(response => response.text())
    .then(data => parseCSV(data))
    .then(dataset => {
        // Now you have the dataset, you can use it here
        console.log('Parsed dataset:', dataset);
        drawMapSquares(dataset);
    })
    .catch(error => {
        console.error('Error reading CSV:', error);
    });

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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
                            '#ffffcc';
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
    });

    // Iterate over each square and draw it on the map
    Object.keys(squareData).forEach(key => {
        let points = squareData[key];
        let totalValue = points.reduce((acc, curr) => acc + curr.value, 0);
        let averageValue = totalValue / points.length;
        let color = getColor(averageValue);
        // Calculate the bounds of the square
        let xIndex = parseInt(key.split('_')[0]);
        let yIndex = parseInt(key.split('_')[1]);
        let topLeft = L.latLng(texasBounds.getNorth() - yIndex * squareHeight, texasBounds.getWest() + xIndex * squareWidth);
        let bottomRight = L.latLng(texasBounds.getNorth() - (yIndex + 1) * squareHeight, texasBounds.getWest() + (xIndex + 1) * squareWidth);
        let squareBounds = L.latLngBounds(topLeft, bottomRight);
        // Create a rectangle for the square and add to map
        L.rectangle(squareBounds, {color: color, weight: 0, fillOpacity: 0.5}).addTo(map1);
    });
}

// ------------------------------------------------------------------------------------------------------------------------------------------------
// LEGEND
// ------------------------------------------------------------------------------------------------------------------------------------------------

// create legend & add to map
let legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

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

legend.addTo(map1);



// --------------------------------------------------------------------------------------------------------------------------
// My first incomplete strawman......
// --------------------------------------------------------------------------------------------------------------------------

//// define pore pressure layer
// fetch('/data')
//     .then(response => response.json())
//     .then(data => {
//         // Process data received from the server
//         console.log(data);

//         let getInterval = function (feature) {
//             let startTime = new Date(feature.properties["Time"]).getTime();
//             let endTime = new Date(feature.properties["Time"]).getTime();
//             return { start: startTime, end: endTime };
//         };

//         let timeline_pore_pressure = L.timeline(data, {
//             getInterval: getInterval,
//             pointToLayer: function (feature, latlng) {
//                 let pressure = feature.properties["Pressure"];
//                 // let radius = Math.max(3, Math.sqrt(volume) / 20); 
//                 // return L.circleMarker(latlng, { radius: radius }).bindPopup(`Volume Injected: ${volume} BBLs`);
//             }
//         });

//         timelineControl.addTimelines(timeline_pore_pressure);
//         timeline_pore_pressure.addTo(map1);

//         //--------------------------------------------------
        
//         var data = [
//             { lat: 31.53370266496937, lon: -103.777418085535, value: 10 },
//             { lat: 31.534198092955776, lon: -103.760445906687, value: 20 },
//             // Add more data points as needed
//         ];

//         // Create hexbin layer
//         let hexLayer = L.hexbinLayer({
//             radius: 20,  // Adjust this value as needed
//             opacity: 0.7,
//             colorScaleExtent: [0, 100],  // Define the range of your numerical values
//             colorRange: ['blue', 'red']  // Define the color gradient
//         }).addTo(map1);

//         // Add data to the hexbin layer
//         hexLayer.data(data.map(function(d) {
//             return [d.lat, d.lon, d.value];
//         }));

//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

// --------------------------------------------------------------------------------------------------------------------------
// Roxana's injection code for reference......
// --------------------------------------------------------------------------------------------------------------------------

// fetch('../../data/injection_data_v2.geojson')
//     .then(response => response.json())
//     .then(data => {
//         let getInterval = function (feature) {
//             let startTime = new Date(feature.properties["Injection Date"]).getTime();
//             let endTime = new Date(feature.properties["Injection End Date"]).getTime();
//             return { start: startTime, end: endTime };
//         };

//         let timeline = L.timeline(data, {
//             getInterval: getInterval,
//             pointToLayer: function (feature, latlng) {
//                 let volume = feature.properties["Volume Injected (BBLs)"];
//                 let radius = Math.max(3, Math.sqrt(volume) / 20); 
//                 return L.circleMarker(latlng, { radius: radius }).bindPopup(`Volume Injected: ${volume} BBLs`);
//             }
//         });

//         // let timelineControl = L.timelineSliderControl({
//         //     formatOutput: function (date) {
//         //         return new Date(date).toDateString();
//         //     }
//         // });

//         // timelineControl.addTo(map1);
//         timelineControl.addTimelines(timeline);
//         timeline.addTo(map1);

//         // timeline.on('change', function () {
//         //     updateList(timeline);
//         // });
//     });

// --------------------------------------------------------------------------------------------------------------------------
// Code from 'earthquakes.html' file for reference.......
// --------------------------------------------------------------------------------------------------------------------------

// // eqfeed_callback is called once the earthquake geojsonp file below loads
// function eqfeed_callback(data) {
//     var getInterval = function (quake) {
//       // earthquake data only has a time, so we'll use that as a "start"
//       // and the "end" will be that + some value based on magnitude
//       // 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
//       // map for 150 minutes or 2.5 hours
//       return {
//         start: quake.properties.time,
//         end: quake.properties.time + quake.properties.mag * 1800000,
//       };
//     };
//     var timelineControl = L.timelineSliderControl({
//       formatOutput: function (date) {
//         return new Date(date).toString();
//       },
//     });
//     var timeline = L.timeline(data, {
//       getInterval: getInterval,
//       pointToLayer: function (data, latlng) {
//         var hue_min = 120;
//         var hue_max = 0;
//         var hue =
//           (data.properties.mag / 10) * (hue_max - hue_min) + hue_min;
//         return L.circleMarker(latlng, {
//           radius: data.properties.mag * 3,
//           color: "hsl(" + hue + ", 100%, 50%)",
//           fillColor: "hsl(" + hue + ", 100%, 50%)",
//         }).bindPopup(
//           '<a href="' + data.properties.url + '">click for more info</a>'
//         );
//       },
//     });
//     timelineControl.addTo(map);
//     timelineControl.addTimelines(timeline);
//     timeline.addTo(map);
//     timeline.on("change", function (e) {
//       updateList(e.target);
//     });
//     updateList(timeline);
//   }
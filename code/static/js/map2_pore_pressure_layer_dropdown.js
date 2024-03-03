// Create and load pore pressure layer to map2 for Layer 9

// Define the bounds of Texas
let texasBounds = L.latLngBounds(
    [25.8371, -106.6466], // Southwest coordinates of Texas
    [36.5007, -93.5083]  // Northeast coordinates of Texas
);

// Function to fetch data from Flask route
async function fetchDataFromFlask() {
    try{
        const response = await fetch('/pressure_data_9');
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

        const featuresByDate = groupFeaturesByDate(dataset);
        console.log(featuresByDate);

        // Populate dropdown and initialize selection
        let selectedDate = '2024-01-01'; // Define the initial selected date
        populateDropdown(featuresByDate); // Populate the dropdown
        setTimeout(() => {
            initSelection(selectedDate); // Initialize selection
        }, 0);

        // Call the function to render squares for the initial selected date
        drawMapSquares(featuresByDate, selectedDate);

        // ------------------------------------------------------------------------------------------------------------------------------------------------
        // GROUP GEOJSON DATA BY DATE
        // ------------------------------------------------------------------------------------------------------------------------------------------------

        // Function to organize features by date
        function groupFeaturesByDate(geojson) {
            // console.log('Type of features:', typeof features);
            // Convert features to an array if it's an object
            // const featuresArray = Array.isArray(features) ? features : [features];
            // console.log('featuresArray:',featuresArray);

            const featuresByDate = {};
            geojson.features.forEach(feature => {
                // Convert properties from string to number
                for (const prop in feature.properties) {
                    if (!isNaN(parseFloat(feature.properties[prop]))) {
                        feature.properties[prop] = parseFloat(feature.properties[prop]);
                    } 
                    else if (prop === 'date') {
                        // Convert date format
                        const dateObj = new Date(feature.properties[prop]);
                        const year = dateObj.getUTCFullYear();
                        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getUTCDate()).padStart(2, '0');
                        feature.properties[prop] = `${year}-${month}-${day}`;
                    }
                };
                // Convert coordinates from string to number
                for (const coord in feature.geometry.coordinates) {
                    if (!isNaN(parseFloat(feature.geometry.coordinates[coord]))) {
                        feature.geometry.coordinates[coord] = parseFloat(feature.geometry.coordinates[coord]);
                    }
                };

                if (!featuresByDate[feature.properties.date]) {
                    featuresByDate[feature.properties.date] = [];
                }
                featuresByDate[feature.properties.date].push(feature);
            });
            return featuresByDate;
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------
        // SQUARES
        // ------------------------------------------------------------------------------------------------------------------------------------------------

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
                   value > 0     ? '#ffffcc' :
                                   '#ffffff' ;
        }

        // Function to draw map squares based on pressure data
        function drawMapSquares(featuresByDate, selectedDate) {
            // Calculate the number of squares needed
            let width = texasBounds.getEast() - texasBounds.getWest();
            let height = texasBounds.getNorth() - texasBounds.getSouth();

            // Calculate number of squares horizontally and vertically
            let numHorizontalSquares = Math.ceil(width / (3 / 69)); // 1 degree latitude is approximately 69 miles
            let numVerticalSquares = Math.ceil(height / (3 / 69));

            // Calculate the dimensions of each square
            let squareWidth = width / numHorizontalSquares;
            let squareHeight = height / numVerticalSquares;

            // Create a dictionary to store data points for each square
            let squareData = {};

            // return features associated with selected date
            console.log("Selected Date:", selectedDate);
            let selectedFeatures = featuresByDate[selectedDate];
            console.log("Selected Features:", selectedFeatures);

            // Iterate over each data point and assign it to the corresponding square
            selectedFeatures.forEach(point => {
                
                // Calculate the square index for the data point
                let xIndex = Math.floor((Number(point.geometry.coordinates[0]) - texasBounds.getWest()) / squareWidth);
                let yIndex = Math.floor((texasBounds.getNorth() - Number(point.geometry.coordinates[1])) / squareHeight);
                // Create a unique key for the square
                let key = xIndex + '_' + yIndex;
                // Initialize array for the square if not exists
                if (!squareData[key]) {
                    squareData[key] = [];
                }
                // Add the data point to the square
                squareData[key].push(point);
            });
            console.log("squareData:", squareData);

            // Iterate over each square and draw it on the map
            Object.keys(squareData).forEach(key => {
                let points = squareData[key];
                // Iterate through all points within each square, and return the average pressure_delta in order to assign the color of the square
                let totalDelta = 0
                points.forEach(point => {
                    totalDelta += point.properties.pressure_delta
                });
                let averageDelta = totalDelta / points.length;
                let color = getColor(averageDelta);
                // Calculate the bounds of the square
                let xIndex = parseInt(key.split('_')[0]);
                let yIndex = parseInt(key.split('_')[1]);
                let topLeft = L.latLng(texasBounds.getNorth() - yIndex * squareHeight, texasBounds.getWest() + xIndex * squareWidth);
                let bottomRight = L.latLng(texasBounds.getNorth() - (yIndex + 1) * squareHeight, texasBounds.getWest() + (xIndex + 1) * squareWidth);
                let squareBounds = L.latLngBounds(topLeft, bottomRight);
                // console.log('squareBounds: ', squareBounds)
                // Create a rectangle for the square and add to map
                let rectangle = L.rectangle(squareBounds, {color: color, weight: 0, fillOpacity: 0.5}).addTo(map2);
                
                // Add click event listener to each rectangle
                rectangle.on('click', function(e) {
                    // Show clickover information with averageDelta
                    $(this._container).clickover({
                        html: true,
                        title: 'Average Pressure Delta<br>of All Data Within This Square',
                        content: '<strong>' + averageDelta.toFixed(2) + '</strong>',
                        placement: 'top'
                    });
                    // Trigger the clickover to show immediately
                    $(this._container).clickover('show');
                });
            });
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------
        // DROPDOWN
        // ------------------------------------------------------------------------------------------------------------------------------------------------

        // Dropdown element
        let dropdown = L.control({position: 'topright'});

        // Function to populate the dropdown with available month/year dates
        function populateDropdown(featuresByDate) {
            console.log("Populating dropdown...");
            let dropdownContent = '<select id="dateDropdownContainer">';
            console.log("Features by date:", featuresByDate); // Log featuresByDate to inspect its contents

            // Get unique date keys
            const uniqueDates = Object.keys(featuresByDate);
            // console.log("Unique dates:", uniqueDates); // Log uniqueDates to inspect its contents

            // Sort unique date keys in ascending order
            let sortedDates = uniqueDates.sort((a, b) => new Date(a) - new Date(b));
            // console.log("Sorted dates: ", sortedDates);

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
            div.innerHTML = populateDropdown(featuresByDate); // Populate dropdown content

            // Event listener for dropdown change
            div.querySelector('select').addEventListener('change', function(e) {
                console.log('Dropdown value changed:', e.target.value);
                let selectedDate = e.target.value;

                // Iterate over existing layers and remove only those representing squares
                map2.eachLayer(layer => {
                    // Check if the layer represents a square
                    if (layer instanceof L.GeoJSON && layer.options && layer.options.className === 'squareLayer') {
                        map2.removeLayer(layer);
                    }
                });

                drawMapSquares(featuresByDate, selectedDate); 
            });

            return div;
        };

        // Add dropdown control to the map
        dropdown.addTo(map2);

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

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to initialize the dropdown selection with the identified starting date
function initSelection(selectedDate) {
    document.getElementById('dateDropdownContainer').value = selectedDate;
}

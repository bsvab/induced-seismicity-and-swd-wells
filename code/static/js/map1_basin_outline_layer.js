// make a request to the API endpoint
const basin_outlines_api_url = 'https://services7.arcgis.com/FGr1D95XCGALKXqM/arcgis/rest/services/SedimentaryBasins_US_EIA/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';

fetch(basin_outlines_api_url)
    .then(response => response.json())
    .then(data => {
        // parse the JSON response and add features to the map
        L.geoJSON(data.features, {
            className: 'sedimentary-basins-layer' // add a class name to the GeoJSON layer
        }).addTo(map1);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
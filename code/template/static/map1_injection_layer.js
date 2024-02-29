// Load GeoJSON data and create a timeline
fetch('../../data/injection_data_v2.geojson')
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

    });

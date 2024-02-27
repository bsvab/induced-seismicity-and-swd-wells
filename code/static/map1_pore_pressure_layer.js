// Code from 'earthquakes.html' file for quick reference.......
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
let basins = [
    'Anadarko Basin',
    'Appalachian Basin',
    'Fort Worth Basin',
    'Gulf Coast Basin',
    'Illinois Basin',
    'Michigan Basin',
    'Oklahoma Platform Basins',
    'Permian Basin',
    'Rocky Mountain Basins',
    'Williston Basin'
];

let basins_no_spaces = [
    "AnadarkoBasin",
    "AppalachianBasin",
    "FortWorthBasin",
    "GulfCoastBasin",
    "IllinoisBasin",
    "MichiganBasin",
    "OklahomaPlatformBasins",
    "PermianBasin",
    "RockyMountainBasins",
    "WillistonBasin"
];

let elements = ["Ca", "Mg", "HCO3", "Si", "FeTot", "Ba", "Sr", "Li"];

// initialize the dashboard at start up 
function init() {

    // populate the dropdown menu
    populateDropdownMenu(basins)

    // Set the first basin from the list as the initial selection from the dropdown list
    let first_basin = basins[0];
    console.log(first_basin);

    // populate the associated visuals for that basin
    populateVisuals(first_basin)

    // set event listener for dropdown menu change = if change occurs, update charts
    let dropdown_list = d3.select("#selectBasin");  
    dropdown_list.on("change", function() {
    let selection = this.value;
    populateVisuals(selection);
    });

};

// call the initialize function
init();

// get sample names and populate the dropdown list
function populateDropdownMenu(basins) {
    
    // select the dropdown menu
    let dropdown_list = d3.select("#selectBasin");
    
    basins.forEach(basin => {
        dropdown_list.append("option")
            .text(basin)
            .attr("value", basin);
    });
    
};

// use below function to source images via Flask...
// generate all visuals for selected basin
function populateVisuals(selection) {
    fetch('/chemistry_image_urls')
        .then(response => response.json())
        .then(data => {
            let boxplotImageUrls = data.chemistry_boxplot_image_urls;
            let violinplotImageUrls = data.chemistry_violinplot_image_urls;
            let piperplotImageUrls = data.chemistry_piperplot_image_urls;

            // Populate box plots
            elements.forEach(element => {
                let boxplotImgElement = document.getElementById(`imgElement_BoxPlot_${element}`);
                let boxplotUrl = boxplotImageUrls[`${selection}_${element}`];
                boxplotImgElement.src = boxplotUrl;
            });

            // Populate violin plots
            elements.forEach(element => {
                let violinplotImgElement = document.getElementById(`imgElement_ViolinPlot_${element}`);
                let violinplotUrl = violinplotImageUrls[`${selection}_${element}`];
                violinplotImgElement.src = violinplotUrl;
            });

            // Populate piper plots
            let piperTriangleImgElement = document.getElementById('imgElement_Piper(Triangle)');
            piperTriangleImgElement.src = piperplotImageUrls[selection].piper_triangle;

            let piperContourImgElement = document.getElementById('imgElement_Piper(Contour)');
            piperContourImgElement.src = piperplotImageUrls[selection].piper_contour;

            let piperColorImgElement = document.getElementById('imgElement_Piper(Color)');
            piperColorImgElement.src = piperplotImageUrls[selection].piper_color;
        })
        .catch(error => console.error('Error fetching chemistry image URLs:', error));
}

// ---------------------------------------------------------------------------------------------

// let basins = [
//     'Anadarko Basin',
//     'Appalachian Basin',
//     'Fort Worth Basin',
//     'Gulf Coast Basin',
//     'Illinois Basin',
//     'Michigan Basin',
//     'Oklahoma Platform Basins',
//     'Permian Basin',
//     'Rocky Mountain Basins',
//     'Williston Basin'
// ];

// let basins_no_spaces = [
//     "AnadarkoBasin",
//     "AppalachianBasin",
//     "FortWorthBasin",
//     "GulfCoastBasin",
//     "IllinoisBasin",
//     "MichiganBasin",
//     "OklahomaPlatformBasins",
//     "PermianBasin",
//     "RockyMountainBasins",
//     "WillistonBasin"
// ];

// let elements = ["Ca", "Mg", "HCO3", "Si", "FeTot", "Ba", "Sr", "Li"];

// // initialize the dashboard at start up 
// function init() {
  
//     // populate the dropdown menu
//     populateDropdownMenu(basins)

//     // Set the first basin from the list as the initial selection from the dropdown list
//     let first_basin = basins[0];
//     console.log(first_basin);

//     // populate the associated visuals for that basin
//     populateVisuals(first_basin)

//     // set event listener for dropdown menu change = if change occurs, update charts
//     let dropdown_list = d3.select("#selectBasin");  
//     dropdown_list.on("change", function() {
//     let selection = this.value;
//     populateVisuals(selection);
//     });
  
// };
  
// // call the initialize function
// init();
  
// // get sample names and populate the dropdown list
// function populateDropdownMenu(basins) {
    
//     // select the dropdown menu
//     let dropdown_list = d3.select("#selectBasin");
    
//     basins.forEach(basin => {
//         dropdown_list.append("option")
//             .text(basin)
//             .attr("value", basin);
//     });
    
// };

// // below function works if sourcing images locally...
// // // generate all visuals for selected basin
// // function populateVisuals(selection) {

// //     let basin_index = basins.indexOf(selection);
// //     let basin = basins_no_spaces[basin_index]

// //     for (let e = 0; e < elements.length; e++) {
// //         let element = elements[e]
// //         // violin plots
// //         let imgElement1 = document.getElementById(`imgElement_ViolinPlot_${element}`); // Get the reference to the img element
// //         imgElement1.src = `../static/images/chemistry/ViolinPlot_${basin}_${element}.png`; // Set the source of the image
// //         // box plots
// //         let imgElement2 = document.getElementById(`imgElement_BoxPlot_${element}`); // Get the reference to the img element
// //         imgElement2.src = `../static/images/chemistry/BoxPlot_${basin}_${element}.png`; // Set the source of the image
// //     }

// //     // piper plots
// //     let imgElement3 = document.getElementById(`imgElement_Piper(Triangle)`); // Get the reference to the img element
// //     imgElement3.src = `../static/images/chemistry/Piper(Triangle)_${basin}.png`; // Set the source of the image
// //     let imgElement4 = document.getElementById(`imgElement_Piper(Contour)`); // Get the reference to the img element
// //     imgElement4.src = `../static/images/chemistry/Piper(Contour)_${basin}.png`; // Set the source of the image
// //     let imgElement5 = document.getElementById(`imgElement_Piper(Color)`); // Get the reference to the img element
// //     imgElement5.src = `../static/images/chemistry/Piper(Color)_${basin}.png`; // Set the source of the image
    
// // };

// // use below function to source images via Flask...
// // generate all visuals for selected basin
// function populateVisuals(selection) {
//     let basin_index = basins.indexOf(selection);
//     let basin = basins_no_spaces[basin_index];

//     for (let e = 0; e < elements.length; e++) {
//         let element = elements[e];
//         // violin plots
//         let imgElement1 = document.getElementById(`imgElement_ViolinPlot_${element}`);
//         imgElement1.src = `{{ url_for('static', filename='images/chemistry/ViolinPlot_${basin}_${element}.png') }}`;

//         // box plots
//         let imgElement2 = document.getElementById(`imgElement_BoxPlot_${element}`);
//         imgElement2.src = `{{ url_for('static', filename='images/chemistry/BoxPlot_${basin}_${element}.png') }}`;
//     }

//     // piper plots
//     let imgElement3 = document.getElementById('imgElement_Piper(Triangle)');
//     imgElement3.src = `{{ url_for('static', filename='images/chemistry/Piper(Triangle)_${basin}.png') }}`;

//     let imgElement4 = document.getElementById('imgElement_Piper(Contour)');
//     imgElement4.src = `{{ url_for('static', filename='images/chemistry/Piper(Contour)_${basin}.png') }}`;

//     let imgElement5 = document.getElementById('imgElement_Piper(Color)');
//     imgElement5.src = `{{ url_for('static', filename='images/chemistry/Piper(Color)_${basin}.png') }}`;
// }

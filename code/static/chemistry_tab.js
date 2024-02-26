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

// generate all visuals for selected basin
function populateVisuals(selection) {

    let basin_index = basins.indexOf(selection);
    let basin = basins_no_spaces[basin_index]

    for (let e = 0; e < elements.length; e++) {
        let element = elements[e]
        // violin plots
        let imgElement1 = document.getElementById(`imgElement_ViolinPlot_${element}`); // Get the reference to the img element
        imgElement1.src = `../images/chemistry/ViolinPlot_${basin}_${element}.png`; // Set the source of the image
        // box plots
        let imgElement2 = document.getElementById(`imgElement_BoxPlot_${element}`); // Get the reference to the img element
        imgElement2.src = `../images/chemistry/BoxPlot_${basin}_${element}.png`; // Set the source of the image
    }

    // piper plots
    let imgElement3 = document.getElementById(`imgElement_Piper(Triangle)`); // Get the reference to the img element
    imgElement3.src = `../images/chemistry/Piper(Triangle)_${basin}.png`; // Set the source of the image
    let imgElement4 = document.getElementById(`imgElement_Piper(Contour)`); // Get the reference to the img element
    imgElement4.src = `../images/chemistry/Piper(Contour)_${basin}.png`; // Set the source of the image
    let imgElement5 = document.getElementById(`imgElement_Piper(Color)`); // Get the reference to the img element
    imgElement5.src = `../images/chemistry/Piper(Color)_${basin}.png`; // Set the source of the image
    
};

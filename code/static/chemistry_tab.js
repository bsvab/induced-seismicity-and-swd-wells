// $(".dropdown-menu li a").click(function(){
//     $(this).parents(".dropdown").find('.btn-basin').html($(this).html() + ' <span class="caret"></span>');
//     $(this).parents(".dropdown").find('.btn-basin').val($(this).data('value'));
//   });

// ------------------------------------------------------------------------------------------------------------------------------------

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
]

// initialize the dashboard at start up 
function init() {
  
    // populate the dropdown menu
    populateDropdownMenu(basins)

    // Set the first basin from the list as the initial selection from the dropdown list
    let first_basin = basins[0];
    console.log(first_basin);

    // populate the associated visuals for that basin
    generateVisuals(first_basin)

    // set event listener for dropdown menu change = if change occurs, update charts
    let dropdown_list = d3.select("#selDataset");  
    dropdown_list.on("change", function() {
    let selection = this.value;
    generateVisuals(selection);
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
function generateVisuals(selection) {
    //...
};

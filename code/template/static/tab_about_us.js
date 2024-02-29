let team = ["roxana_darvari", "brittany_svab", "alejandro_juarez", "sarah_cain", "john_cahill"]

// initialize at start up 
function init() {
    populateHeadshots(team);
};
  
// call the initialize function
init();

// generate all headshots
function populateHeadshots(team) {

    for (let p = 0; p < team.length; p++) {
        let person = team[p]
        
        let imgElement = document.getElementById(`headshot_${person}`); // Get the reference to the img element
        imgElement.src = `../../images/team/${person}.png`; // Set the source of the image

        imgElement.onerror = function() {
            // If image doesn't exist, set source to the default image
            imgElement.src = "../../images/team/headshot_icon.png";
        };
    }
};

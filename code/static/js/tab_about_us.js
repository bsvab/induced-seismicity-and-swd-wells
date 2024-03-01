let team = ["roxana_darvari", "brittany_svab", "alejandro_juarez", "sarah_cain", "john_cahill"]

// initialize at start up 
function init() {
    populateHeadshots(team);
};
  
// call the initialize function
init();

// code to use if sourcing images locally...
// generate all headshots
// function populateHeadshots(team) {

//     for (let p = 0; p < team.length; p++) {
//         let person = team[p]
        
//         let imgElement1 = document.getElementById(`headshot_${person}`); // Get the reference to the img element
//         imgElement1.src = `../static/images/team/${person}.png`; // Set the source of the image

//         imgElement1.onerror = function() {
//             // If image doesn't exist, set source to the default image
//             imgElement1.src = "../static/images/team/headshot_icon.png";
//         };
//     }
// };

// let imgElement2 = document.getElementById(`logo_li`); // Get the reference to the img element
// imgElement2.src = `../static/images/team/linkedin_logo_white_21.png`; // Set the source of the image

// let imgElement3 = document.getElementById(`logo_gh`); // Get the reference to the img element
// imgElement3.src = `../static/images/team/github_logo_white.png`; // Set the source of the image

// code to use if sourcing images via Flask...
// generate all headshots
function populateHeadshots(team) {
    for (let p = 0; p < team.length; p++) {
        let person = team[p];
        
        let imgElement1 = document.getElementById(`headshot_${person}`); // Get the reference to the img element
        imgElement1.src = `{{ url_for('static', filename='images/team/${person}.png') }}`; // Set the source of the image

        imgElement1.onerror = function() {
            // If image doesn't exist, set source to the default image
            imgElement1.src = "{{ url_for('static', filename='images/team/headshot_icon.png') }}";
        };
    }
}

let imgElement2 = document.getElementById('logo_li'); // Get the reference to the img element
imgElement2.src = "{{ url_for('static', filename='images/team/linkedin_logo_white_21.png') }}"; // Set the source of the image

let imgElement3 = document.getElementById('logo_gh'); // Get the reference to the img element
imgElement3.src = "{{ url_for('static', filename='images/team/github_logo_white.png') }}"; // Set the source of the image

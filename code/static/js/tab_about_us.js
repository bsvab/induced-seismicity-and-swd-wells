let team = ["roxana_darvari", "brittany_svab", "alejandro_juarez", "sarah_cain", "john_cahill"]

// initialize at start up 
function init() {
    populateHeadshots(team);
};

// call the initialize function
init();

function populateHeadshots() {
    // Make an AJAX request to fetch image URLs
    fetch('/team_image_urls')
        .then(response => response.json())
        .then(imageUrls => {
            // Iterate through the imageUrls dictionary
            Object.keys(imageUrls).forEach(person => {
                let imgElements = document.querySelectorAll(`.headshot_${person}`);
                // Set the source of each image
                imgElements.forEach(imgElement => {
                    imgElement.src = imageUrls[person];
                    console.log(imageUrls[person]);
                    imgElement.onerror = function() {
                        // Log the error
                        console.error(`Error loading image for ${person}: ${imageUrls[person]}`);
                        // If image doesn't exist, set source to the default image
                        imgElement.src = "{{ url_for('static', filename='images/team/headshot_icon.png') }}";
                    };
                });
            });
        })
        .catch(error => console.error('Error fetching image URLs:', error));
}

// let imgElement2 = document.getElementById('logo_li'); // Get the reference to the img element
// imgElement2.src = "{{ url_for('static', filename='images/team/linkedin_logo_white_21.png') }}"; // Set the source of the image

let imgElements2 = document.querySelectorAll('.logo_li'); // Get all elements with class 'logo_li'
imgElements2.forEach(function(imgElement) {
    imgElement.src = "{{ url_for('static', filename='images/team/linkedin_logo_white_21.png') }}"; // Set the source of each image
});

// let imgElement3 = document.getElementById('logo_gh'); // Get the reference to the img element
// imgElement3.src = "{{ url_for('static', filename='images/team/github_logo_white.png') }}"; // Set the source of the image

let imgElements3 = document.querySelectorAll('.logo_gh'); // Get all elements with class 'logo_gh'
imgElements3.forEach(function(imgElement) {
    imgElement.src = "{{ url_for('static', filename='images/team/github_logo_white.png') }}"; // Set the source of each image
});
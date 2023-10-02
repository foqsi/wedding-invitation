window.initMap = function () {
    // Page objects
    let displayMap = document.getElementById("displayMap");
    let grandHouse = { lat: 35.49665, lng: -97.53472 };

    let myMap = new google.maps.Map(displayMap, {
        zoom: 16,
        center: grandHouse,
        fullscreenControl: false,
    });

    // Create a marker for the Grand House Asian Bistro
    var marker = new google.maps.Marker({
        position: grandHouse,
        map: myMap,
        title: "Grand House Asian Bistro"
    });

    // InfoWindow content
    var infoContent = '<div id="infoWindow">' +
        '<h2>Grand House Asian Bistro</h2>' + '<p>2701 N Classen Blvd, Oklahoma City, OK 73106</p></div>';

    // Create InfoWindow
    var infoWindow = new google.maps.InfoWindow({
        content: infoContent
    });

    // Add a click event listener to the marker
    marker.addListener('click', function () {
        infoWindow.open(myMap, marker);
    });
}



let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll("#photo-gallery .slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 2000); // Change slide every 2 seconds
}

function addSubmitAndResetHandlers() {
    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        let name = document.getElementById("name").value;
        let numOfAdditionalPersons = document.getElementById("guests").value;
        console.log("Name: ", name);
        console.log("Number of Guests: ", numOfAdditionalPersons);
        // You can add your firebase code here to save the data.
    });

    let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("name").value = '';
        document.getElementById("guests").value = '';
    });
}

let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let numOfAdditionalPersons = parseInt(document.getElementById("guests").value, 10);

    // push new rsvp data to the 'rsvps' path
    let newRSVPRef = db.ref('rsvps').push();
    newRSVPRef.set({
        name: name,
        additionalGuests: numOfAdditionalPersons
    })
    .then(() => {
        console.log('Data written successfully!');
        
        // Update the total count in the 'total' path
        db.ref('total').transaction((currentTotal) => {
            return (currentTotal || 0) + numOfAdditionalPersons + 1;  // +1 is for the person who filled the form
        });

        // Clear the input fields after successful submission
        document.getElementById("name").value = '';
        document.getElementById("guests").value = '';
    })
    .catch((error) => {
        console.error('Data write failed:', error);
    });
});


db.ref('total').on('value', (snapshot) => {
    let total = snapshot.val();
    console.log('Total guests:', total);

    // display the total somewhere on the page
    // for example, if you have a element with id "totalGuests"
    document.getElementById("totalGuests").textContent = total;
});






window.onload = function () {
    showSlides();
    addSubmitAndResetHandlers();
}
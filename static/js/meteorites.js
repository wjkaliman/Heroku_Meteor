


// Create the createMap function
function createMap(meteorLocation) {
    var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var BaseMaps = {
        "Satellite Map": satellitemap,
        "Dark Map": darkmap,
    };

    var overlayMaps = {
        "Meteor Hits": meteorLocation
    };



    var myMap = L.map("map-id", {
        center: [37.74, -25.68],
        zoom: 3,
        layers: [satellitemap, meteorLocation]
    });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // layer is my function
    L.control.layers(BaseMaps, overlayMaps,
        {
            collapsed: false
        }).addTo(myMap);



};

//create the Markers function
function createMarkers(meteorHits) {
    console.log(meteorHits)
    //create an array to hold lat and lon markers
    var meteorMarkers = [];
    // loop through the GeoLocations array
    for (var index = 0; index < meteorHits.length; index++) {
        var ameteorHit = meteorHits[index];
        ameteorHit.reclat = +ameteorHit.reclat;
        ameteorHit.reclong = +ameteorHit.reclong;
        // console.log(ameteorHit)
        if (ameteorHit.reclat !== 0 && ameteorHit.reclong !== 0) {
            //     // for each geolocation, create a marker and bind a popup with the meteors name
            var marker = L.marker([ameteorHit.reclat, ameteorHit.reclong]);
            marker.bindPopup("<p> Name: " + ameteorHit.name + "</p>" +
                "<p> Mass: " + ameteorHit["mass (g)"] + "</p><p> Location: " + ameteorHit.GeoLocation + "<p> Year: " + ameteorHit.year)
            // Add the marker to the array
            meteorMarkers.push(marker);
        }

    }
    console.log(meteorMarkers)
    // Create a layer group made from the meteorHits array, pass it into the createMap function


    createMap(L.layerGroup(meteorMarkers));
}



console.log("hey Joe");

d3.json("http://localhost:5000/api/landing_data")
    .then(function (response) {

        console.log(response);
        console.log(typeof (response))
        Object.entries(response.data[0]).forEach(function ([key, value]) {
            console.log(key, value)
        });
        // Pull the "Meteorites hits" off of the data
        createMarkers(response.data)
    });

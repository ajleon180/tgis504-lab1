var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    accessToken: 'pk.eyJ1IjoiYWpsZW9uMTgwIiwiYSI6ImNsYTQ4ZDVqcTA5cHYzd21seGszbWI3eDIifQ.yaXUrccsnQ_RHZqxu7UKNw',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoiYWpsZW9uMTgwIiwiYSI6ImNsYTQ4ZDVqcTA5cHYzd21seGszbWI3eDIifQ.yaXUrccsnQ_RHZqxu7UKNw',
    tileSize: 512,
    zoomOffset: -1,
});

var baseMaps = {
    "Light": light,
    "Dark": dark
};

var map = L.map('map', {layers:[light]}).fitWorld();

var layerControl = L.control.layers (baseMaps).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius <= 100) {
            L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
        }
        else{
            L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
        };
    //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
    //NOTE: the styling changes based on whether the accuracy is within 100 meters, but the measurement unit in the text box is in feet.

    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var dawn = times.dawn.getHours();
    var dusk = times.dusk.getHours();

    var currentTime = new Date().getHours();
        if (dawn < currentTime && currentTime < dusk){
        map.removeLayer(dark);
        map.addLayer(light);
        }
        else {
        map.removeLayer(light);
        map.addLayer(dark);
        };
};

map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
    alert(e.message);
  }
  
map.on('locationerror', onLocationError);

L.easyButton('<b>Click Here</b>', function(btn, map){
        map.locate({setView: true, maxZoom: 16});
    }).addTo(map);

window.alert("This website will show your location based on the location information from your device. In order for this website to have full functionality, you must agree to share your location information.");

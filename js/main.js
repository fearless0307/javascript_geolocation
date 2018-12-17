let x;
let googleMap;

let position = [0, 0];

let map;
let infowindow;

// List of searches
let searches  = [
'movie_theater',
'bus_station',
'train_station',
'shooping_mall',
'taxi_stand',
'travel_agency',
'hospital'
];


// Onload function
window.onload = function start() {
  console.log("Started");
  x = document.getElementById("detail");
  googleMap = document.getElementById("googleMap");

  getLocation();
}

// Get the location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

// Show position
function showPosition(position) {

  position[0] = position.coords.latitude;
  position[1] = position.coords.longitude;

  x.innerHTML = "Latitude: " + position[0] +
  "<br>Longitude: " + position[1];

  console.log("Latitude: " + position[0]);
  console.log("Longitude: " + position[1]);

  let latlng = new google.maps.LatLng(position[0], position[1]);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: true,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(googleMap, myOptions);

  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  infowindow = new google.maps.InfoWindow();

  let service = new google.maps.places.PlacesService(map);

  for(let search of searches){
    console.log("Searching " + search);
    service.nearbySearch({
      location: latlng,
      radius: 5000,
      type: search
    }, callback);
  }
}

// Callback after getting place details
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

// Create marker on map
function createMarker(place) {
  console.log(place);
  var placeLoc = place.geometry.location;

  var icon = {
    url: place.icon, // url
    scaledSize: new google.maps.Size(20, 20), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  var marker = new google.maps.Marker({
    map: map,
    icon: icon,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.vicinity + '</div>');
    infowindow.open(map, this);
  });
}

// Show error
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}

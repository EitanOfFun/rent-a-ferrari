/*global google, Modernizr, Worker, $, console, alert*/


var directionsDisplay = new google.maps.DirectionsRenderer(),
    geocoder = new google.maps.Geocoder(),
    directionsService = new google.maps.DirectionsService(),
    map;

displayMap(31.30, 34.45);
document.getElementById('map-route-btn').addEventListener('click', mapRouteBtn);

function disableCheckout() {
  'use strict';
  document.getElementById('total-price').innerHTML = '';
  document.getElementById('checkout-btn').disabled = true;
}

function inputChanging() {
  'use strict';
  document.getElementById('route-price').innerHTML = '';
  disableCheckout();
}


function enableCheckout() {
  'use strict';
  document.getElementById('checkout-btn').disabled = false;
}


function showDefaultMapAndLogError(error) {
  // default center of map is Israel
  displayMap(31.30, 34.45);
  switch (error.code) {
  case error.PERMISSION_DENIED:
    console.log("User denied the request for Geolocation.");
    break;
  case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.");
    break;
  case error.TIMEOUT:
    console.log("The request to get user location timed out.");
    break;
  case error.UNKNOWN_ERROR:
    console.log("An unknown error occurred.");
    break;
  }
}

function initMap() {
  'use strict';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showDefaultMapAndLogError);
  } else {
    displayMap(31.30, 34.45);
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  'use strict';
  displayMap(position.coords.latitude, position.coords.longitude);
}

function displayMap(lat, lng) {
  'use strict';
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(lat, lng)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function updatePrice(e) {
  document.getElementById('route-price').innerHTML = '+' + e.data + '$';
  document.getElementById('total-price').innerHTML = (510 + e.data) + '$';
}

function calcRoute(from, to) {
  'use strict';
  var worker = new Worker('scripts/worker.js'),
    request = {
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode.DRIVING
    };
  worker.addEventListener('message', updatePrice, false);
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      setConfirmedLocation(from, to);
      worker.postMessage(response.routes[0].legs[0].distance.value);

      $(function () {
        $('.meter > span').each(function () {
          $(this)
            .data('origWidth', $(this).width())
            .width('20%')
            .animate({
              width: '100%'
            }, 1000, enableCheckout);
        });
      });
    }
  });
}

function setConfirmedLocation(from, to) {
  document.getElementById('confirmed-from-location').innerHTML = from;
  document.getElementById('confirmed-to-location').innerHTML = to;
}

function mapRouteBtn() {
  'use strict';
  var from = document.getElementById('from').value,
    to = document.getElementById('to').value;

  if (from !== '' && to !== '') {
    calcRoute(from, to);
    return;
  } else if (from === '') {
    //using location for FROM
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({
          'latLng': latLng
        }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              document.getElementById('confirmed-from-location').innerHTML = results[1].formatted_address;
              document.getElementById('confirmed-to-location').innerHTML = to;
              calcRoute(results[1].formatted_address, to);
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      });
    }
  } else if (to === '') {
    //using location for TO
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({
          'latLng': latLng
        }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              document.getElementById('confirmed-from-location').innerHTML = from;
              document.getElementById('confirmed-to-location').innerHTML = results[1].formatted_address;
              calcRoute(from, results[1].formatted_address);
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        });
      });
    }
  } else {
    //can't leave both blank
    return false;
  }
}

function codeLatLng(lat, lng, elm) {
  'use strict';
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        elm.innerHTML = results[1].formatted_address;
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });
}



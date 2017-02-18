/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, jQuery */

function getWeather() {
  "use strict";
  // console.log(lat);
  // console.log(lon);
  // console.log('http://cors.io/?u=https://api.darksky.net/forecast/a29dc7cba1edb350df6260b72ce042c9/'+lat+','+lon);
  $.ajax({
    url: 'https://api.darksky.net/forecast/a29dc7cba1edb350df6260b72ce042c9/-27.595377799999998,-48.548049899999995',
    dataType: 'jsonp',
    success: function(data) {
      console.log(JSON.stringify(data));

      // $('#quote').html(quote);
      // $('#tweet-quote').attr("href", 'https://twitter.com/intent/tweet?text=' + $('#quote').html() + "-" + author);
    },
    error: function(err) { 
      console.log(JSON.stringify(err));
    },
    complete: function(data) {
      console.log(JSON.stringify(data.responseText));
    },
    beforeSend: function(xhr) {
      
    }
  });
};

// function codeAddress(location) {
//   geocoder = new google.maps.Geocoder();
//   geocoder.geocode( { 'address': location}, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       var data = {};
//       data["lat"] = results[0].geometry.location.lat();
//       data["lon"] = results[0].geometry.location.lng();
//       return data;

//       // console.log(results[0].geometry.location.lat());
//       // console.log(results[0].geometry.location.lng());
//     } 
//     else {
//       console.log("Geocode was not successful for the following reason: " + status);
//       return false;
//     }
//   });
// }

$(document).ready(function () {
  "use strict";
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var data = {};
  //     data["lat"] = position.coords.latitude;
  //     data["lon"] = position.coords.longitude;
  //     console.log(JSON.stringify(data));
  //     getWeather(data.lat, data.lon);
  //   });
  // }
  // console.log(JSON.stringify(codeAddress("Dubai")));
  getWeather();
});

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, jQuery */

function getWeather(data) {
  "use strict";
  var categories = ["famous", "movies"];
  
  data["q"] = "New York";
  data["APPID"] = "805418e886455718d75d86ba7717ac34";
  $.ajax({
    url: '//api.openweathermap.org/data/2.5/weather?',
    type: 'GET',
    data: data,
    dataType: 'json',
    success: function(data) {
      console.log(JSON.stringify(data));

      // $('#quote').html(quote);
      // $('#author').html("- " + author);
      // $('#tweet-quote').attr("href", 'https://twitter.com/intent/tweet?text=' + $('#quote').html() + "-" + author);
    },
    error: function(err) { 
      console.log(JSON.stringify(err));
    },
    beforeSend: function(xhr) {
      
    }
  });
};

$(document).ready(function () {
  "use strict";
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var data = {};
  //     // data["lat"] = position.coords.latitude;
  //     // data["lon"] = position.coords.longitude;
  //     getWeather(data);
  //   });
  // }
  var data = {};
  getWeather(data);
});

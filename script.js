/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, jQuery */

var temp = 0;
var skycons = new Skycons();
setSkycon("clear-day");

function setSkycon(weatherType) {
  var skycon = null;
  switch (weatherType) {
    case "clear-day":
      skycon = Skycons.CLEAR_DAY;
      break;
    case "clear-night":
      skycon = Skycons.CLEAR_NIGHT;
      break;
    case "rain":
      skycon = Skycons.RAIN;
      break;
    case "snow":
      skycon = Skycons.SNOW;
      break;
    case "sleet":
      skycon = Skycons.SLEET;
      break;
    case "wind":
      skycon = Skycons.WIND;
      break;
    case "fog":
      skycon = Skycons.FOG;
      break;
    case "cloudy":
      skycon = Skycons.CLOUDY;
      break;
    case "partly-cloudy-day":
      skycon = Skycons.PARTLY_CLOUDY_DAY;
      break;
    case "partly-cloudy-night":
      skycon = Skycons.PARTLY_CLOUDY_NIGHT;
      break;
  }

  if (skycon !== null) {
    skycons.set("skycon", skycon);
    skycons.play();
  }
}

$(document).ready(function () {
  "use strict";
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
       var data = {};
       data["lat"] = position.coords.latitude;
       data["lon"] = position.coords.longitude;
       console.log(JSON.stringify(data));
       codeAddress(data.lat +" "+ data.lon);
     });
   }
});


function getWeather(data) {
  "use strict";
  $.ajax({
    url: 'https://api.darksky.net/forecast/a29dc7cba1edb350df6260b72ce042c9/'+data.lat+','+data.lon,
    data: {
      "exclude" : "minutely,hourly,daily,alerts,flags",
      "units" : "si"
    },
    dataType: 'jsonp',
    success: function(res) {
      console.log(JSON.stringify(res, null, 2));
      setSkycon(data.currently.icon);
      $('#location').html(data.city + ", " + data.country);
      temp = res.currently.temperature;
      $('#temp').html(Math.round(temp));
//      $('#tweet-quote').attr("href", 'https://twitter.com/intent/tweet?text=' + $('#quote').html() + "-" + author);
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

function codeAddress(location) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
//      console.log(JSON.stringify(results[0], null, 2));
      var data = {};
      data["lat"] = results[0].geometry.location.lat();
      data["lon"] = results[0].geometry.location.lng();
      data["city"] = "";
      data["country"] = "";
//      console.log("starting");
      for(var i=0; i<results[0].address_components.length; i++) {
//        console.log(JSON.stringify(results[0].address_components[i], null, 2));
        if (results[0].address_components[i].types[0] == "locality") {
          data["city"] = results[0].address_components[i].long_name;
        }
        if (results[0].address_components[i].types[0] == "country") {
          data["country"] = results[0].address_components[i].long_name;
        }
      }
      console.log(JSON.stringify(data, null, 2));
      getWeather(data);
      return true;
    }
    else {
      console.log("Geocode was not successful for the following reason: " + status);
      return false;
    }
  });
}


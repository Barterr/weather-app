/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, jQuery, Skycons */

var temp = 0;
var celsius = true;
var skycons = new Skycons();

$(document).ready(function () {
  "use strict";
  var input = $("input");
  input[0].selectionStart = input[0].selectionEnd = input.val().length;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var data = {};
      data["lat"] = position.coords.latitude;
      data["lon"] = position.coords.longitude;
      //       console.log(JSON.stringify(data));
      codeAddress(data.lat +" "+ data.lon);
    });
  }
  $(document).keypress(function(e) {
    if(e.which == 13) {
      var loc = $('#location').val();
  //    console.log(loc);
      codeAddress(loc);
      return false;
    }
  });
  $("#unit").click(function() {
    celsius = !celsius;
    setTemp();
  });
});

function setTemp() {
  if (celsius) {
    $('#temp').html(Math.round(temp));
    $('#unit').html("C");
  } else {
    $('#temp').html(Math.round((temp*9/5)+32));
    $('#unit').html("F");
  }
}

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
//      console.log(JSON.stringify(res, null, 2));
      setSkycon(res.currently.icon);
      if (data.city != "") {
        $('#location').val(data.city + ", " + data.country);
      } else if (data.city2 != "") {
        $('#location').val(data.city2 + ", " + data.country);
      } else {
        $('#location').val(data.country);
      }
      temp = res.currently.temperature;
      setTemp();
      $('#summary').html(res.currently.summary);
      var el = $("input:text").get(0);
      var elemLen = el.value.length;

      el.selectionStart = elemLen;
      el.selectionEnd = elemLen;
      el.focus();
    },
    error: function(err) { 
      console.log(JSON.stringify(err));
    }
  });
};

function codeAddress(location) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address': location},
                   function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
//      console.log(JSON.stringify(results[0], null, 2));
      var data = {};
      data["lat"] = results[0].geometry.location.lat();
      data["lon"] = results[0].geometry.location.lng();
      data["city"] = "";
      data["city2"] = "";
      data["country"] = "";
      for(var i=0; i<results[0].address_components.length; i++) {
//        console.log(JSON.stringify(results[0].address_components[i], null, 2));
        var types = results[0].address_components[i].types;
        if (types.indexOf("locality") > -1) {
          data["city"] = results[0].address_components[i].long_name;
        } else if (types.indexOf("administrative_area_level_2") > -1) {
          data["city2"] = results[0].address_components[i].long_name;
        } else if (types.indexOf("country") > -1) {
          data["country"] = results[0].address_components[i].long_name;
//          if (data["country"].length > 20) {
//            data["country"] = results[0].address_components[i].short_name;
//          }
        }
      }
//      console.log(JSON.stringify(data, null, 2));
      getWeather(data);
      return true;
    }
    else {
      console.log("Geocode was not successful for the following reason: " + status);
      return false;
    }
  });
}


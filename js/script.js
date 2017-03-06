/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, jQuery, Skycons */

$(document).ready(function () {

  var weather = (function () {
    var celsius = true;
    var skycons = new Skycons();
    var data = {
      tempCelsius: 0,
      city: "",
      country: "",
      lat: "",
      lon: "",
      weather: "",
      summary: ""
    }

    //cache DOM
    var $doc = $(document);
    var $input = $("input");
    var $location = $('#location');
    var $unit = $("#unit");
    var $temp = $("#temp");
    var $summary = $('#summary');

    //bind events
    $unit.on("click", toggleUnit);
    $doc.keypress(onEnter);

    //init
    setCursor();
    getUserPosition();

    //methods
    function render() {
      if (celsius) {
        $temp.html(Math.round(data.tempCelsius));
        $unit.html("C");
      } else {
        $temp.html(Math.round((data.tempCelsius * 9 / 5) + 32));
        $unit.html("F");
      }
      if (data.city != "") {
        $location.val(data.city + ", " + data.country);
      } else {
        $location.val(data.country);
      }

      $summary.html(data.summary);
      setSkycon(data.weather);
      setCursor();
    }

    function setCursor() {
      var el = $("input:text").get(0); //usar $input
      el.selectionStart = el.value.length;
      el.selectionEnd = el.value.length;
      el.focus();
    }

    function toggleUnit() {
      celsius = !celsius;
      render();
    }

    function onEnter(e) {
      if (e.which == 13) {
        getLocation($location.val());
      }
    }

    function getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var data = {};
          data.lat = position.coords.latitude;
          data.lon = position.coords.longitude;
          getLocation(data.lat + " " + data.lon);
        });
      }
    }

    function getLocation(location) {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({
          'address': location
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            data.lat = results[0].geometry.location.lat();
            data.lon = results[0].geometry.location.lng();
            data.city = "";
            data.country = "";
            for (var i = 0; i < results[0].address_components.length; i++) {
              var types = results[0].address_components[i].types;
              if ((types.indexOf("locality") > -1) || (types.indexOf("administrative_area_level_2") > -1)) {
                data["city"] = results[0].address_components[i].long_name;
              } else if (types.indexOf("country") > -1) {
                data["country"] = results[0].address_components[i].long_name;
              }
            }
            getWeather();
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
    }

    function getWeather() {
      $.ajax({
        url: `https://api.darksky.net/forecast/a29dc7cba1edb350df6260b72ce042c9/${data.lat},${data.lon}`,
        data: {
          "exclude": "minutely,hourly,daily,alerts,flags",
          "units": "si"
        },
        dataType: 'jsonp',
        success: function (res) {
          data.weather = res.currently.icon;
          data.tempCelsius = res.currently.temperature;
          data.summary = res.currently.summary;
          render();
        }
      });
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

  })();

});
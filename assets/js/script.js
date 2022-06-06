var weatherDashBoard = document.querySelector("#weather-dashboard");
var searchEl = document.querySelector("#search-text");
var city;

//get a city the user searches
var getCity = function(city){
    var LocationSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",840&limit=1&appid=862fa80dbf9297962c039ac6e9c8e055"

    fetch(LocationSearch).then(function(response) {
        response.json().then(function(data) {
          var cityLat = data[0].lat;
          var cityLong = data[0].lon;
          
          var locationInfo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,daily&appid=862fa80dbf9297962c039ac6e9c8e055"
          fetch(locationInfo).then(function(response){
              response.json().then(function(data){
                  city = data;
                  getCityCurrentDay(city);
              })
          })
        });
    });
}

//prints to the current-day box the searched city
var getCityCurrentDay = function(city){
    console.log(city);
    //print the temp of the current city
    var tempEl = document.getElementById("temp");
    tempEl.textContent = "Temp: " + kelvinToFahrenheit(city.current.temp) + " \u00B0F";

    //print the wind of the current city
    var windEl = document.getElementById("wind");
    windEl.textContent = "Wind: " + city.current.wind_speed + "MPH";

    //print the humidity of the current city
    var humidityEl = document.getElementById("humidity");
    humidityEl.textContent = "Humidity: " + city.current.humidity + "%";
}

//openWeather returns all temps in Kelvin so this converts to fahrenheit
var kelvinToFahrenheit = function(kelvin){
    var fahr = ((kelvin-273.15)*1.8)+32;
    fahr = fahr.toFixed(2);
    return fahr;
}

//check to see if the user has clicked the search button
var btnHandler = function(event){
    var userTarget = event.target;
    if(userTarget.matches("#search")){
        var city = searchEl.value;
        getCity(city);
    }
}



weatherDashBoard.addEventListener("click", btnHandler);
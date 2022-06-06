var weatherDashBoard = document.querySelector("#weather-dashboard");
var searchEl = document.querySelector("#search-text");
var cityName = "";
var searchHistoryNames = [];
var searchHistoryLimit = 5;

//get a city the user searches
var getCity = function(cityName){
    var LocationSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",840&limit=1&appid=862fa80dbf9297962c039ac6e9c8e055"
    searchEl.value = "Loading...";

    fetch(LocationSearch).then(function(response) {
        response.json().then(function(data) {
          var cityLat = data[0].lat;
          var cityLong = data[0].lon;
          
          var locationInfo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,daily&appid=862fa80dbf9297962c039ac6e9c8e055"
          fetch(locationInfo).then(function(response){
              response.json().then(function(data){
                  searchEl.value = "";
                  var cityObj = data;
                  addToSearchHistory(cityName);
                  getCityCurrentDay(cityName, cityObj);
              })
          })
        });
    });
}

//prints to the current-day box the searched city
var getCityCurrentDay = function(cityName, cityObj){

    //Print the current City
    var cityNameEl = document.getElementById("city-current-day");
    cityNameEl.textContent = cityName;

    //print the temp of the current city
    var tempEl = document.getElementById("temp");
    tempEl.textContent = "Temp: " + kelvinToFahrenheit(cityObj.current.temp) + " \u00B0F";

    //print the wind of the current city
    var windEl = document.getElementById("wind");
    windEl.textContent = "Wind: " + cityObj.current.wind_speed + "MPH";

    //print the humidity of the current city
    var humidityEl = document.getElementById("humidity");
    humidityEl.textContent = "Humidity: " + cityObj.current.humidity + "%";
}

//openWeather returns all temps in Kelvin so this converts to fahrenheit
var kelvinToFahrenheit = function(kelvin){
    var fahr = ((kelvin-273.15)*1.8)+32;
    fahr = fahr.toFixed(2);
    return fahr;
}

//stores city information if a user looks up another city
var addToSearchHistory = function(cityName){
    //create a new element to hold the past city
    var newCity = document.createElement("button");
    newCity.type = "submit";
    newCity.className = "w-100";
    newCity.setAttribute("id", "history");
    newCity.setAttribute("data-name", cityName);
    newCity.textContent = cityName;

    if(searchHistoryNames.length < searchHistoryLimit){
        //add to the begining of the array
        searchHistoryNames.unshift(newCity);
    }else{
        //add to the begining of the array
        searchHistoryNames.unshift(newCity);

        //remove the last result of the array
        searchHistoryNames.pop();
    }
    printSearchHistory();
}

//print search History to the screen
var printSearchHistory = function(){
    var listEl = document.getElementById("search-history-list");
    //remove the currently display list
    if(listEl.lastChild){
        while(listEl.lastChild){
            listEl.removeChild(listEl.lastChild);
        }
    }

    //reprint the search history list
    for(var i = 0; i < searchHistoryNames.length; i++){
        listEl.appendChild(searchHistoryNames[i]);
    }
}

//check to see if the user has clicked the search button
var btnHandler = function(event){
    var userTarget = event.target;
    if(userTarget.matches("#search")){
        cityName = searchEl.value;
        getCity(cityName);
    }else if(userTarget.matches("#history")){
        //request that cities info again
        getCity(userTarget.textContent);


        //temp arr for sotring everything but the selected array
        var temp = [];

        // //remove button from search history array
        for(var i = 0; i < searchHistoryNames.length; i++){
            if(searchHistoryNames[i].getAttribute("data-name") != userTarget.textContent){
                //if it does not match add to temp array
                temp.push(searchHistoryNames[i]);
            }
        }

        searchHistoryNames = temp;
        console.log(searchHistoryNames);
        printSearchHistory();
    }
}


weatherDashBoard.addEventListener("click", btnHandler);
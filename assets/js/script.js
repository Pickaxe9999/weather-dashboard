var weatherDashBoard = document.querySelector("#weather-dashboard");
var searchEl = document.querySelector("#search-text");
var fiveDaysConsoleEl = document.querySelector("#five-day-forecast");
var cityName = "";
var cityHistoryBtns = [];
var searchHistoryLimit = 5;

//get a city the user searches
var getCity = function(cityName){
    var LocationSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",840&limit=1&appid=862fa80dbf9297962c039ac6e9c8e055"
    searchEl.value = "Loading...";

    fetch(LocationSearch).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
          var cityLat = data[0].lat;
          var cityLong = data[0].lon;
          
          var locationInfo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=minutely,hourly&appid=862fa80dbf9297962c039ac6e9c8e055"
          fetch(locationInfo).then(function(response){
              response.json().then(function(data){
                  console.log("loading weather");
                  console.log(data);
                  searchEl.value = "";
                  var cityObj = data;
                  addToSearchHistory(cityName);
                  getCityCurrentDay(cityName, cityObj);
                  fiveDayForecast(cityObj.daily);
              })
          })
        });
    });
}

//prints to the current-day box the searched city
var getCityCurrentDay = function(cityName, cityObj){

    //Print the current City and todays date
    var date = new Date(cityObj.daily[0].dt*1000);
    date = date.toLocaleString().split(",", 1);
    var cityNameEl = document.getElementById("city-current-day");
    cityNameEl.textContent = cityName + " - " + date;

    //print the temp of the current city
    var tempEl = document.getElementById("temp");
    tempEl.textContent = "Temp: " + kelvinToFahrenheit(cityObj.current.temp) + " \u00B0F";

    //print the wind of the current city
    var windEl = document.getElementById("wind");
    windEl.textContent = "Wind: " + cityObj.current.wind_speed + "MPH";

    //print the humidity of the current city
    var humidityEl = document.getElementById("humidity");
    humidityEl.textContent = "Humidity: " + cityObj.current.humidity + "%";

    //print the humidity of the current city
    var uvIndexEl = document.getElementById("uv-index");
    getUVIndex(cityObj.current.uvi);
    uvIndexEl.textContent = cityObj.current.uvi;
}

//prints the five day forcast
var fiveDayForecast = function(cityObj){
    //remove the previous cities five days
    if(fiveDaysConsoleEl.lastChild){
        while(fiveDaysConsoleEl.lastChild){
            fiveDaysConsoleEl.removeChild(fiveDaysConsoleEl.lastChild);
        }
    }

    //print the current cities five day forecast
    for(var i =1; i < 6; i++){
        singleForcast(cityObj[i]);
    }
}

//print a single days forecast
var singleForcast = function(cityDailyObj){
    //create a card that holds a single days information
    var dailyForecastEl = document.createElement("div");
    dailyForecastEl.className = "col";
    dailyForecastEl.setAttribute("id", "daily-forecast");

    //create the date, weather, temp, wind, and humidity tags
    var dateEl = document.createElement("p");
    var date = new Date(cityDailyObj.dt*1000);
    dateEl.textContent = date.toLocaleString().split(",", 1);
    dailyForecastEl.appendChild(dateEl);
    
    //weather icon
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", " http://openweathermap.org/img/wn/" + cityDailyObj.weather[0].icon + "@2x.png");
    dailyForecastEl.appendChild(iconEl);

    //temp
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + kelvinToFahrenheit(cityDailyObj.temp.day) + " \u00B0F";
    dailyForecastEl.appendChild(tempEl);

    //wind
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + cityDailyObj.wind_speed + "MPH";
    dailyForecastEl.appendChild(windEl);

    //humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + cityDailyObj.humidity + "%";
    dailyForecastEl.appendChild(humidityEl);

    fiveDaysConsoleEl.appendChild(dailyForecastEl);
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

    if(cityHistoryBtns.length < searchHistoryLimit){
        //add to the begining of the array
        cityHistoryBtns.unshift(newCity);
    }else{
        //add to the begining of the array
        cityHistoryBtns.unshift(newCity);

        //remove the last result of the array
        cityHistoryBtns.pop();
    }
    saveSearchHistory(cityHistoryBtns);
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
    for(var i = 0; i < cityHistoryBtns.length; i++){
        listEl.appendChild(cityHistoryBtns[i]);
    }
}

//create a span tag  with the UV index
var getUVIndex = function(uvIndex){
    var uvIndexEl = document.getElementById("uv-index");
    if(uvIndex > 0 && uvIndex <= 2){
        uvIndexEl.className = "low-index";
    }else if(uvIndex > 2 && uvIndex <= 5){
        uvIndexEl.className = "medium-index";
    }else if(uvIndex > 2 && uvIndex <= 5){
        uvIndexEl.className = "high-index";
    }else if(uvIndex > 2 && uvIndex <= 5){
        uvIndexEl.className = "very-high-index";
    }else if(uvIndex >= 11){
        uvIndexEl.className = "extreme-index";
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

        //remove button from search history array
        for(var i = 0; i < cityHistoryBtns.length; i++){
            if(cityHistoryBtns[i].getAttribute("data-name") != userTarget.textContent){
                //if it does not match add to temp array
                temp.push(cityHistoryBtns[i]);
            }
        }

        //reprint the buttons with the selected button at the most recent history
        cityHistoryBtns = temp;
        printSearchHistory();
    }else if(userTarget.matches("#delete-search-history")){
        deleteSearchHistory();
    }
}

var saveSearchHistory = function(cityHistoryBtns){
    var saveBtnValue = [];
    for(var i = 0; i < cityHistoryBtns.length; i++){
        saveBtnValue[i] = cityHistoryBtns[i].textContent;
    }
    localStorage.setItem("saveBtnValue", JSON.stringify(saveBtnValue));
}

var loadSearchHistory = function(){
    var saveBtnValue = JSON.parse(localStorage.getItem("saveBtnValue"));
    if(!saveBtnValue){
        return;
    }

    //create the array of btns without it unshifting inserting in a different order like in add to search History
    for(var i = 0; i < saveBtnValue.length; i++){
        var newCity = document.createElement("button");
        newCity.type = "submit";
        newCity.className = "w-100";
        newCity.setAttribute("id", "history");
        newCity.setAttribute("data-name", saveBtnValue[i]);
        newCity.textContent = saveBtnValue[i];
        cityHistoryBtns.push(newCity);
    }
    printSearchHistory();
}

var deleteSearchHistory = function(){
    localStorage.clear();
}

loadSearchHistory();
weatherDashBoard.addEventListener("click", btnHandler);
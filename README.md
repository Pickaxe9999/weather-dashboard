# weather-dashboard

AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city

Branch Breakdown
-feature/city-information
The user can search up the name of a city to retrieve data on its current weather conditions

-feature/city-search-history
When the user searches for another city then the previous city is moved into a history column they can click to retrieve that information again

-feature/uv-index
when the user searches for a city the UV index is also retrived and displayed with ranging colors based on severity

-feature/five-day-forecast
when the user seaches for a city the five-day forecast is displayed with the following five days forecast

-feature/search-history-storage
When the user clicks on a city from the history tab then that information is retrieved from local storage if the current day has not changed, if the day has changed then it recalls the api to get an updated forecast
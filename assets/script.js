/*-----------------Time Display--------------*/
var timeDisplayEl = $('#time-display');
function displayTime() {
  var rightNow = moment().format('MMM DD, YYYY');
  timeDisplayEl.text(rightNow);
}
displayTime();



/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
>> 
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
>> DONE
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
>> DONE
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
>> 
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

var apiKey = "ebeec47b73133b922547940ec79600b6";
var today = moment().format('L');
var searchHistoryList = [];
//var cityGeocash = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid={API key}';
//var forecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';
/*--------------------FUTURE FORECAST (5DAY)----------------------*/
function citySearchFuture(lat, lon) {
  var key = 'ebeec47b73133b922547940ec79600b6';
  var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${key}`;
  fetch(futureURL) 
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      console.log(data);
      for(let i=1; i<6; i++){
        var futureCondition = $('<div>');
        futureCondition.addClass('col-12 border rounded px-3 py-3');
        var futureConditionDate = $('<h2>');
        console.log(data.daily[i])
        var aVarStuff = moment.unix(data.daily[i].dt).format("MMMM Do YYYY");
        futureConditionDate.text(aVarStuff);
        futureConditionDate.appendTo(futureCondition);
        var futureConditionIcon = $('<img>')
        futureConditionIcon.attr('src', 'https://openweathermap.org/img/w/'+ data.daily[i].weather[0].icon +'.png');
        console.log(futureConditionIcon);
        futureConditionIcon.appendTo(futureCondition);
        var futureConditionTemp = $('<p>')
        futureConditionTemp.text('temp: ' + data.daily[i].temp.day)
        futureConditionTemp.appendTo(futureCondition);
        var futureConditionHumidity = $('<p>')
        futureConditionHumidity.text('humidity: '+data.daily[i].humidity)
        futureConditionHumidity.appendTo(futureCondition);
        fiveDayView = $('#five-day')
        futureCondition.appendTo(fiveDayView);
      }
    })
    .catch(function () {
      // catch any errors
    });
}
/*---------UV INDEX----------------------*/
function UvIndex(lat, lon){
  var key = 'ebeec47b73133b922547940ec79600b6';
  var UvIndexURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${key}`;
  fetch(UvIndexURL)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      console.log(data);
      var UvIndexCard = $('<p>')
      UvIndexCard.text(data.value);
      // 0-2 green, 3-5 blue, 6-7 orange, 8-10 red, 11+teal
      if (data.value >= 0 && data.value <= 2) {
        UvIndexCard.addClass('bg-success');
    } else if (data.value >= 3 && data.value <= 5) {
      UvIndexCard.addClass('bg-primary');
    } else if (data.value >= 6 && data.value <= 7) {
      UvIndexCard.addClass('bg-warning');
    } else if (data.value >= 8 && data.value <= 10) {
      UvIndexCard.addClass('bg-danger');
    } else {
      UvIndexCard.addClass('bg-info'); 
    };  
      $("#city-display").append(UvIndexCard)
    })
    .catch(function () {
      // catch any errors
    });
}
/*---------Log Questions */
function logCity(){
  var logCityName = $('<li>')
  logCityName.attr('onclick',searchFunction())
  logCityName.text(cityName);
  var shitnadamakeitgo = ('#search-history')
  logCityName.appendTo(shitnadamakeitgo)
}
/*---------PRESENT DAY FORCAST-----------https://leetcode.com/ */
function citySearchPresent(cityName) {
  var key = 'ebeec47b73133b922547940ec79600b6';
  $('#city-display').empty()
  $('#five-day').empty()
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      citySearchFuture(lat,lon);
      UvIndex(lat,lon);
      //LOGGER
      logCity(cityName)
      // console.log(lat);
      // console.log(lon);
      console.log(data);
      searchHistoryList.push(cityName)
      var currentForecastCard = $('<h2>')
      currentForecastCard.attr('id', 'currentCity')
      currentForecastCard.text(data.name + " " + today)
      var currentForecastCardSub = $('<p>');
      currentForecastCardSub.text("temp: " + data.main.temp);
      var currentForecastCardSub2 = $('<p>');
      currentForecastCardSub2.text("humidity: " + data.main.humidity);
      var currentForecastCardSub3 = $('<p>');
      currentForecastCardSub3.text("windspeed: " + data.wind.speed + "MPH");
      $("#city-display").append(currentForecastCard);
      $("#city-display").append(currentForecastCardSub);
      $("#city-display").append(currentForecastCardSub2);
      $("#city-display").append(currentForecastCardSub3);
    })
    .catch(function () {
      // catch any errors
    });
}
/*--------------SEARCH FUNCTION----------*/
function searchFunction() {
  var searchedText = $("#search-bar").val();
  console.log(searchedText);
  citySearchPresent(searchedText);
  $('#search-bar').val('')
}

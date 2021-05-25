let cities = []

let cityForm = document.querySelector('#citySearch');
let cityInput = document.querySelector('#city');
let pastSearch = document.querySelector('#pastButton');
let weatherContainer = document.querySelector('#currentWeather');
let citySearched = document.querySelector('#searchedCity');
let forecastTitle = document.querySelector("#forecast");
let forecastContainer = document.querySelector("#dayContainer");

const forSubmitHandler = function (event) {
    event.preventDefault();
    let city = cityInput.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInput.value = "";
    } else {
        alert("Enter City");
    }
    saveSearch();
    searchedItems(city);
}
const saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

const getCityWeather = function (city) {
    const apiKey = "85646075460d0a8199b875127947c841"
    const apiURL = 'http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}&appid={apiKey}'

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city);

            });
        });
};

const displayWeather = function (weather, searchCity) {
    //deletes
    weatherContainer.textContent = "";
    citySearched.textContent = searchCity;

    //Create a new Date
    const currentDate = document.createElement("span")
    currentDate.textContent = "(" + SVGAnimateMotionElement(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearched.appendChild(currentDate);

    //Create Image
    const weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", 'https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png');
    citySearched.appendChild(weatherIcon);

    //Create span to hold temperature
    const temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + "°F";
    temperatureEl.classicList = "list-group-item"

    //Create span to hold Humidity
    const humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classicList = "list-group-item"

    //create span to hold Wind
    const windEl = document.createElement("span");
    windEl.textContent = "Wind Speed: " + weather.main.temp + "MPH";
    windEl.classicList = "list-group-item"

    //Add to Main Container
    weatherContainer.appendChild(temperatureEl);

    weatherContainer.appendChild(humidityEl);

    weatherContainer.appendChild(windEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

const getUvIndex=function(lat,lon){
    const apiKey = "85646075460d0a8199b875127947c841"
    const apiURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}'
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
            console.log(data)
        });
    });
}
 const displayUvIndex=function(index){
     var uvIndexEl = document.createElement("div");
     uvIndexEl.textContent = "UV Index: "
     uvIndexEl.classList = "list-group-item"

     uvIndexValue = document.createElement("span")
     uvIndexValue.textContent = index.value
 
     if(index.value <=2){
         uvIndexValue.classList = "favorable"
     }else if(index.value >2 && index.value<=8){
         uvIndexValue.classList = "moderate "
     }
     else if(index.value >8){
         uvIndexValue.classList = "severe"
     };
 
     uvIndexEl.appendChild(uvIndexValue);

     weatherContainer.appendChild(uvIndexEl);
 }

 var get5Day = function(city){
    var apiKey = "85646075460d0a8199b875127947c841"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

         //create an image element
         var weatherIcon = document.createElement("img")
         weatherIcon.classList = "card-body text-center";
         weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
  
         //append to forecast card
         forecastEl.appendChild(weatherIcon);
         
         //create temperature span
         var forecastTempEl=document.createElement("span");
         forecastTempEl.classList = "card-body text-center";
         forecastTempEl.textContent = dailyForecast.main.temp + " °F";
  
          //append to forecast card
          forecastEl.appendChild(forecastTempEl);
  
         var forecastHumEl=document.createElement("span");
         forecastHumEl.classList = "card-body text-center";
         forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
  
         //append to forecast card
         forecastEl.appendChild(forecastHumEl);
  
          // console.log(forecastEl);
         //append to five day container
          forecastContainer.appendChild(forecastEl);
      }
        }

        var searchedItems = function(searchedItems){
 
            // console.log(pastSearch)
        
            pastSearchEl = document.createElement("button");
            pastSearchEl.textContent = searchedItems;
            pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
            pastSearchEl.setAttribute("data-city",searchedItems)
            pastSearchEl.setAttribute("type", "submit");
        
            pastSearch.prepend(pastSearchEl);
        }
        
        
        var pastSearchHandler = function(event){
            var city = event.target.getAttribute("data-city")
            if(city){
                getCityWeather(city);
                get5Day(city);
            }
        }
        
        // pastSearch();
        
        cityForm.addEventListener("submit", forSubmitHandler);
        pastSearch.addEventListener("click", pastSearchHandler);
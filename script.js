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
    let city = cityInput.nodeValue.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInput.value = "";
    } else {
        alert("Enter City");
    }
    saveSearch();
    pastSearch(city);
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

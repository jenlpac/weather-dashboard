var searchInputEl = document.querySelector("#searchInput");
var btnEl = document.querySelector("#btn");
var searchHistoryEl = document.querySelector("#searchHistory");

var searchHistoryArr = [];

// Search city on save button click:
var searchCity = function() {
    if (!searchInputEl.value) {
        return;
    }

    var cityName = searchInputEl.value.trim();
    console.log(cityName);
    
    // Call to APIs for weather:
    getCurrentForecast(cityName, true);

    searchInputEl.value = "";
}


// Save searched city to localStorage:
var saveCity = function(cityName) {
    searchHistoryArr.push(cityName);
    localStorage.setItem("cityList", JSON.stringify(searchHistoryArr));
}


// Get searched cities from localStorage:
var getCity = function() {
    console.log("getCity");
    var items = localStorage.getItem("cityList");
    if (items) {
        console.log("searchArray");
        searchHistoryArr = JSON.parse(items);

        for (i = 0; i < searchHistoryArr.length; i++) {
            saveCityList(searchHistoryArr[i]);
        }
    }
}


// Add city list to sidebar and localStorage:
var saveCityList = function(cityName) {
    var listEl = document.createElement("li");
    listEl.innerHTML = cityName;
    listEl.className="list-group-item list-group-item-action";
    listEl.setAttribute("sidebarList", cityName);
    searchHistoryEl.appendChild(listEl);
}

// Get city list from localStorage:
var getCityList = function(){
    var items = localStorage.getItem("sidebarList");
    if (items){
        searchHistoryArr = JSON.parse(items);

        for (i = 0; i < searchHistoryArr.length; i++){
            saveCityList(searchHistoryArr[i]);
        }
    }
}


// Get current weather data
var getCurrentForecast = function(cityName, addToList){
    // Get API Url for weather forecast:
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=c8221caa50c17bc5148346251519cc03";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var containerCurrent = document.getElementById("currentForecast");
                containerCurrent.className = containerCurrent.className.replace(/\binvisible\b/g, "visible");
                document.getElementById("cityName").innerHTML = data.name + "&nbsp;&nbsp;(" + moment().format("M/DD/YYYY") + ")";
                document.getElementById("weatherIcon").src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                console.log(data.weather[0].icon);
                document.getElementById("temperature").innerHTML = data.main.temp + " °F";
                document.getElementById("humidity").innerHTML = data.main.humidity + " %";
                document.getElementById("wind").innerHTML = data.wind.speed + " MPH";
                // Call function to get uv index:

                // Add city to the list and save to local storage:
                if (addToList && !searchHistoryArr.includes(data.name)){
                    saveCityList(data.name);
                    saveCity(data.name);
                }

            });
        } 
    })
    .catch(function(error){
        displayError("Unable to connect to the server.", cityName);
    });
}

// Get UV index:

// Get future forecast:

// Get weather from search history list:



getCity();

// btnEl.addEventListener("click", searchCity);
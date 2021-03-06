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
    getFutureForecast(cityName)

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
    // Get API url for weather forecast:
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=c8221caa50c17bc5148346251519cc03";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var containerCurrent = document.getElementById("currentForecast");
                containerCurrent.className = containerCurrent.className.replace(/\binvisible\b/g, "visible");
                document.getElementById("cityName").innerHTML = data.name + "&nbsp;&nbsp;(" + moment().format("M/DD/YYYY") + ")";
                document.getElementById("weatherIcon").src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                document.getElementById("temperature").innerHTML = data.main.temp + " °F";
                document.getElementById("humidity").innerHTML = data.main.humidity + " %";
                document.getElementById("wind").innerHTML = data.wind.speed + " MPH";
                // Call function to get uv index:
                getUVIndex(data.coord.lat, data.coord.lon, data.name);

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
var getUVIndex = function (lat, lon, cityName) {
    apiUrlUV = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=c8221caa50c17bc5148346251519cc03";

    fetch(apiUrlUV).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.value);
                var uvEl = document.getElementById("uv");
                uvEl.className="col-md-1 text-center text-black rounded-sm";
                uvEl.innerHTML = data.value;
                if (data.value <= 2)
                    uvEl.style.backgroundColor = "green";
                else if (data.value <= 5)
                    uvEl.style.backgroundColor = "yellow";
                else if (data.value <= 7)
                    uvEl.style.backgroundColor = "orange";
                else if (data.value <= 10)
                    uvEl.style.backgroundColor = "red";
                else
                    uvEl.style.backgroundColor = "violet";

            })
        }
    })
    .catch(function(error){
        displayError("Unable to connect to the server.", cityName);
    });
};

// Get future forecast:
var getFutureForecast = function (cityName) {
    // Get API url for future forecast:
    apiUrlFuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=c8221caa50c17bc5148346251519cc03"

    fetch(apiUrlFuture).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                var a = 1;
                // For each day get weather data and create a card
                for (i=0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.includes("12:00:00")) {
                        // Create card:
                        var cardEl = document.getElementById("card" + a);
                        cardEl.className = "card-body bg-primary text-white rounded-sm";
                        cardEl.innerHTML="";
                        // Add date:
                        var dateEl = document.createElement("h5");
                        dateEl.innerHTML = moment(data.list[i].dt_txt).format("MM/DD/YYY");
                        cardEl.appendChild(dateEl);
                        // Add icon:
                        var imgEl = document.createElement("img");
                        imgEl.src = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                        cardEl.appendChild(imgEl);
                        // Add temperature:
                        var tempEl = document.createElement("div");
                        tempEl.innerHTML = "Temperature:&nbsp;&nbsp;" + data.list[i].main.temp + " °F";
                        cardEl.appendChild(tempEl);
                        // Add humidity:
                        var humidEl = document.createElement("div");
                        humidEl.innerHTML = "Humidity:&nbsp;&nbsp;" + data.list[i].main.humidity + " %";
                        cardEl.appendChild(humidEl);

                        a++;
                    }
                }
            });
        }
    })
    .catch(function(error){
        displayError("Unable to connect to the server.", cityName);
    });
}



// Get weather from search history list:
var searchList = function(event) {
    var targetEl = event.target;
    var cityName = event.target.getAttribute("sidebarList");
    getCurrentForecast(cityName, false);
    getFutureForecast(cityName);
};



getCity();

searchHistoryEl.addEventListener("click", searchList);
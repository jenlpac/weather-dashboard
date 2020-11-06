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

    searchInputEl.value = "";
    saveCityList(cityName);
    saveCity(cityName);
}


// Save searched city to localStorage:
var saveCity = function(cityName) {
    searchHistoryArr.push(cityName);
    localStorage.setItem("cityList", JSON.stringify(searchHistoryArr));
}


// Get searched cities from localStorage:
var getCity = function() {
    var items = localStorage.getItem("cityList");
    if (items) {
        searchHistoryArr = JSON.parse(items);

        for (i = 0; i < searchHistoryArr.length; i++) {
            saveCityList(searchHistoryArr[i]);
        }
    }
}


// Create city list in sidebar
var saveCityList = function(cityName) {
    var listEl = document.createElement("li");
    listEl.innerHTML = cityName;
    listEl.className="list-group-item list-group-item-action";
    listEl.setAttribute("sidebarList", cityName);
    searchHistoryEl.appendChild(listEl);
}

// btnEl.addEventListener("click", searchCity);
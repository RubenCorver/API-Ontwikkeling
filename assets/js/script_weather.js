let key = "39fb34d336ee1f54dae30cf62b425b85";
let units = "metric"
let names = [];
let positions = [];
const language = "nl";
let searchTerm;
let weathernames = JSON.parse(localStorage.getItem("cities"));

//Load previous added city's
function weatherLoad(weathernames){
    if(weathernames != null){
        weathernames.forEach(function (name){
            searchTerm = `q=${name}`;
            getWeather(searchTerm);
        })
    }
}

function addCity() {
    let addclass = document.getElementsByClassName("city__input");
    searchTerm = `q=${addclass[0].value.toLowerCase()}`;
    if (searchTerm == "den haag") {
        searchTerm = "the hague";
    } if (names.includes(searchTerm)) {
        console.log("City already displayed")
        return;
    }
    else {
        getWeather(searchTerm);
    }
}

function removeCity() {
    let city = document.getElementsByClassName("city__input");
    let cityname = city[0].value;
    let citydiv = document.getElementsByClassName(`weather__drag ${cityname}`);
    citydiv[0].parentNode.removeChild(citydiv[0]);
    names.splice(cityname.toLowerCase(),1);
    localStorage.setItem("cities", JSON.stringify(names));
}

//Weather API call
function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchTerm}&APPID=${key}&lang=${language}&units=${units}`)
        .then(result => {
            return result.json();
        }).then(function (weather) {
            addWeather(weather);
        })
        .catch(function () {

        });
}

//Add weather info
function addWeather(weather) {
    if (names.includes(weather.name.toLowerCase())) {
        let weatherTemp = document.getElementsByClassName("weather__temp " + weather.name);
        for (let i = 0; i < weatherTemp.length; i++) {
            weatherTemp[i].innerHTML = Math.round(weather.main.temp) + "&deg;";
        }
        let weatherDesc = document.getElementsByClassName("weather__description " + weather.name);
        for (let i = 0; i < weatherDesc.length; i++) {
            weatherDesc[i].innerHTML = "Windspeed: " + weather.wind.speed;
        }
        let weatherRain = document.getElementsByClassName("weather__rain " + weather.name);
        for (let i = 0; i < weatherRain.length; i++) {
            weatherRain[i].innerHTML = weather.weather[0].main;
        }
        console.log("weather update")
    } else {
        let location = document.createElement("article")
        location.className = "weather__location";

        let drag = document.createElement("div")
        drag.className = "weather__drag " + weather.name;
        drag.id = weather.name;
        drag.setAttribute("draggable", "true");
        drag.setAttribute("ondragstart", "drag(event)");
        let left = document.createElement("div")
        left.className = "weather__left " + weather.name;
        let cityName = document.createElement("h3")
        cityName.className = "weather__city " + weather.name;
        let temp = document.createElement("p")
        temp.className = "weather__temp " + weather.name;
        let right = document.createElement("div")
        right.className = "weather__right " + weather.name;
        let rain = document.createElement("p")
        rain.className = "weather__rain " + weather.name;
        let wind = document.createElement("p")
        wind.className = "weather__wind " + weather.name;

        location.setAttribute("ondrop", "drop(event)");
        location.setAttribute("ondragover", "allowDrop(event)");

        cityName.innerHTML = weather.name;
        wind.innerHTML = "Windspeed: " + weather.wind.speed;
        temp.innerHTML = Math.round(weather.main.temp) + "&deg; ";
        rain.innerHTML = weather.weather[0].main;

        left.appendChild(temp);
        left.appendChild(cityName);
        right.appendChild(rain)
        right.appendChild(wind)
        drag.appendChild(left);
        drag.appendChild(right);
        location.appendChild(drag);

        names.push(weather.name.toLowerCase());
        document.querySelector(".weather__container").appendChild(location);
        localStorage.setItem("cities", JSON.stringify(names));
    }
}

//Current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentPosition);
}
function currentPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    searchTerm = `lat=${latitude}&lon=${longitude}`;
    getWeather(searchTerm);
}

//drop and drag
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("src", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    let data = document.getElementById(ev.dataTransfer.getData("src"));
    let dataParent = data.parentNode;
    let target = ev.currentTarget.firstElementChild;

    ev.currentTarget.replaceChild(data, target);
    dataParent.appendChild(target);

    savePositon();
}

function savePositon() {
    let positionId = document.getElementsByClassName("weather__drag");
    names = [];
    for (let i = 0; i < positionId.length; i++) {
        names.push(positionId[i].id.toLowerCase());
        localStorage.setItem("names", JSON.stringify(names));
    }
}

window.onload = function () {
    weatherLoad(weathernames);
}

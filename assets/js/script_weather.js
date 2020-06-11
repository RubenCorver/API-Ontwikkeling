let key = "39fb34d336ee1f54dae30cf62b425b85";
let units = "metric"
let positions = [];
const language = "nl";

//Current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentPosition);
}
function currentPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather();
}

//Weather API call
function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${key}&lang=${language}&units=${units}`)
        .then(result => {
            return result.json();
        }).then(function (data) {
            console.log(data);
        })
        .catch(function () {

        });
}
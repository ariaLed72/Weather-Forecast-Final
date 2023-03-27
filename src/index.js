document.addEventListener("DOMContentLoaded", function changeDate() {
  let h3 = document.querySelector("h3");

  let now = new Date();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  let date = now.getDate();
  let hour = now.getHours();
  if (hour < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  h3.innerHTML = `${hour}:${minutes} ${day} ${month} ${date}, ${year}`;
});

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row" >`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
    <div class="col-2">
      <div class="weather-forecast-date">
      ${formatDay(forecastDay.time)}
      </div>

      <img class="forecast-icon" src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png" 
      alt=${forecastDay.condition.description}
      width="40"/>

      <div class="weather-forecast-temperatures">
<span class="weather-forecast-temperature-maximum">
        ${Math.round(forecastDay.temperature.maximum)}º
</span>
<span class="weather-forecast-temperature-minimum">
        ${Math.round(forecastDay.temperature.minimum)}º
</span>

      </div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
  console.log(apiUrl);

  axios.get(apiUrl).then(displayForecast);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-engine");
  let changeCity = document.querySelector("h1");
  changeCity.textContent = `${searchInput.value}`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchInput.value}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(changeTemp);
}
let fahrenheitTemperature = null;

function changeTemp(response) {
  let wholeTemp = document.querySelector("#big-temp");
  fahrenheitTemperature = Math.round(response.data.temperature.current);
  let temperature = Math.round(response.data.temperature.current);
  wholeTemp.innerHTML = `${temperature}`;
  console.log(response);

  let weatherPattern = document.querySelector("#description");
  let description = response.data.condition.description;
  weatherPattern.innerHTML = `${description}`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.temperature.humidity;

  let feelsLike = document.querySelector("#feels-like");
  let feelsLikeRound = Math.round(response.data.temperature.feels_like);
  feelsLike.innerHTML = `${feelsLikeRound}`;

  let wind = document.querySelector("#wind");
  let windSpeed = Math.round(response.data.wind.speed);
  wind.innerHTML = `${windSpeed}`;

  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let celsiusElement = document.querySelector("#big-temp");
  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  celsiusElement.innerHTML = Math.round(celsiusTemperature);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitElement = document.querySelector("#big-temp");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  fahrenheitElement.innerHTML = Math.round(fahrenheitTemperature);
}

let apiKey = "42ba1b13f6cc540e038b0aeaao0t76f8";

let form = document.querySelector("form");
form.addEventListener("submit", search);

let celsiusLink = document.querySelector("#celsius-conversion");
celsiusLink.addEventListener("click", showCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit-conversion");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

//function showPosition(response) {
// let lat = response.data.coordinates.latitude;
// let lon = response.data.coordinates.longitude;
//let apiUrlPosition = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
//axios.get(apiUrlPosition).then(changeTemp);
//}

//function getCurrentPosition(position) {
//// navigator.geolocation.getCurrentPosition(showPosition);
//}

//let button = document.querySelector("#position-button");
//button.addEventListener("click", getCurrentPosition);

document.addEventListener("DOMContentLoaded", function changeDate() {
  let h3 = document.querySelector("h3");

  let now = new Date();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();
  let hour = now.getHours();
  if (hour < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let day = days[now.getDay()];

  h3.innerHTML = `${hour}:${minutes} ${day} ${month} ${date}, ${year}`;
});

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-engine");
  let changeCity = document.querySelector("h1");
  changeCity.textContent = `${searchInput.value}`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchInput.value}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(changeTemp);
}
let celsiusTemperature = null;

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `
  <div class="row" >`;

  let days = ["Thu", "Fri", "Sat", "Sun"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      ` 
    <div class="col-2">
      <div class="weather-forecast-date">
      ${day}
      </div>
      <img src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-night.png" 
      alt="img"
      width="40"/>
      <div class="weather-forecast-temperatures">
<span class="weather-forecast-temperature-maximum">
        17º
</span>
<span class="weather-forecast-temperature-minimum">
        12º
</span>

      </div>
    </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);

  axios.get(apiUrl).then(displayForecast);
}

function changeTemp(response) {
  let wholeTemp = document.querySelector("#big-temp");
  celsiusTemperature = Math.round(response.data.temperature.current);
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

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitElement = document.querySelector("#big-temp");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  fahrenheitElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let celsiusElement = document.querySelector("#big-temp");
  celsiusElement.innerHTML = Math.round(celsiusTemperature);
}

let apiKey = "42ba1b13f6cc540e038b0aeaao0t76f8";

let form = document.querySelector("form");
form.addEventListener("submit", search);

let fahrenheitLink = document.querySelector("#fahrenheit-conversion");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-conversion");
celsiusLink.addEventListener("click", showCelsiusTemp);

displayForecast();

//function showPosition(position) {
// let lat = position.coordinates.lat;
// let lon = position.coordinates.lon;
//let apiUrlPosition = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
//axios.get(apiUrlPosition).then(changeTemp);
//}

//function getCurrentPosition(position) {
//// navigator.geolocation.getCurrentPosition(showPosition);
//}

//let button = document.querySelector("#position-button");
//button.addEventListener("click", getCurrentPosition);

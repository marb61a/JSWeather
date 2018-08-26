/*
  UI Elements Module
*/
const UI = (function(){
  let menu = document.querySelector("#menu-container");

  // Hide loading screen & show app
  const showApp = () => {
    document.querySelector("#app-loader").classList.add('display-none');
    document.querySelector("main").removeAttribute('hidden');
  }

  // Hide app & show loading screen
  const loadApp = () => {
    document.querySelector("#app-loader").classList.remove('display-none');
    document.querySelector("main").setAttribute('hidden', 'true');
  }

  // Show menu
  const _showMenu = () => menu.style.right = 0;

  // Hide menu
  const _hideMenu = () => menu.style.right = '-65%';

  const _toggleHourlyWeather = () => {
    let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
        arrow = document.querySelector("#toggle-hourly-weather").children[0],
        visible = hourlyWeather.getAttribute('visible'),
        dailyWeather = document.querySelector('#daily-weather-wrapper');
    
    if(visible == 'false'){
      hourlyWeather.setAttribute('visible', true);
      hourlyWeather.style.bottom = 0;
      arrow.style.transform = 'rotate(180deg)';
      dailyWeather.style.opacity = 0;
    } else if(visible == 'true'){
      hourlyWeather.setAttribute('visible', false);
      hourlyWeather.style.bottom = '-100%';
      arrow.style.transform = 'rotate(0deg)';
      dailyWeather.style.opacity = 1;
    } else {
      console.error("Unknown state of the hourly weather panel and visible attribute");
    }
  };

  const drawWeatherData = (data, location) => {
    let currentlyData = data.currently,
        dailyData = data.daily.data,
        hourlyData = data.hourly.data,
        weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dailyWeatherWrapper = document.querySelector('#daily-weather-wrapper'),
        dailyWeatherModel,
        day,
        maxMinTemp,
        dailyIcon,
        hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
        hourlyWeatherModel,
        hourlyIcon;
    
    // Set Current weather 
    document.querySelectorAll('.location-label')
      .forEach((e) => {
        e.innerHTML = location
      });
    
    document.querySelector('main').style.backgroundImage = 
      `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;
    
    document.querySelector("#currentlyIcon")
      .setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
    
    document.querySelector("#summary-label").innerHTML = currentlyData.summary;

    // Set temperature from Fahrenheit -> Celcius
    document.querySelector("#degrees-label").innerHTML =
      Math.round((currentlyData.temperature - 32) * 5 / 9)  + '&#176;'
    
    // Set humidity
    document.querySelector("#humidity-label").innerHTML = 
      Math.round(currentlyData.humidity * 100) + '%';
    
    // Set the wind speed
    document.querySelector("#wind-speed-label").innerHTML =
      (currentlyData.windSpeed * 1.6093).toFixed(1) + ' kph';
    
    /*
      Set the daily weather
    */
    while(dailyWeatherWrapper.children[1]){
      dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
    }

    for (let i = 0; i <= 6; i++){
      // Clones the node and removes the display none close
      dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
      dailyWeatherModel.classList.remove('display-none');

      day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
      dailyWeatherModel.children[0].children[0].innerHTML = day;

      // Set min max temperature in Celcius
      maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) 
        + '&#176;' + '/' 
        + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
      dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
    }

  };

  // Menu events
  document.querySelector('#open-menu-btn').addEventListener('click', _showMenu);
  document.querySelector('#close-menu-btn').addEventListener('click', _hideMenu);

  // Hourly weather wrapper event
  document.querySelector("#toggle-hourly-weather")
    .addEventListener('click', _toggleHourlyWeather);

  return {
    showApp,
    loadApp
  }
})();


/*
  LocalStorage API
*/
const LOCALSTORAGE = (function(){
  let savedCities = [];

  const save = (city) => {
    savedCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify('savedCities'));
  };

  const get = () => {
    if(localStorage.getItem('savedCities') != null){
      savedCities = JSON.parse(localStorage.getItem('savedCities'));
    }
  };

  const remove = (index) => {
    if(index < savedCities.length){
      savedCities.splice(index, 1);
      localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
  };

  const getSavedCities = () => savedCities;

  return {
    save,
    get,
    remove,
    getSavedCities
  };
})();


/*
  Get Location Module
*/
const GETLOCATION = (function(){
  let location;

  const locationInput = document.querySelector('#location-input'),
        addCityBtn = document.querySelector('#add-city-btn');
  
  const _addCity = () => {
    location = locationInput.value;
    locationInput.value = '';
    addCityBtn.setAttribute('disabled', 'true');
    addCityBtn.classList.add('disabled');

    console.log('Get weather for', location);
  }

  locationInput.addEventListener('input', function(){
    let inputText = this.value.trim();

    if(inputText != ''){
      addCityBtn.removeAttribute('disabled');
      addCityBtn.classList.remove('disabled');
    } else {
      addCityBtn.setAttribute('disabled', 'true');
      addCityBtn.classList.add('disabled');
    }

    addCityBtn.addEventListener('click', _addCity);
  })
})();

/*
  Get Weather Data
*/
const WEATHER = (function(){
  const darkSkyKey = '',
        geoCoderKey = '';
  
  const _getGeocodeURL = (location) => 
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

  const _getDarkSkyURL = (lat, lng) => 
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`; 

    const _getDarkSkyData = (url, location) => {
      axios.get(url)
        .then((res) => {
          console.log(res);
          UI.drawWeatherData(res.data, location)
        })
        .catch((err) => {
          console.log(err);
        })
    };

    const getWeather = (location) => {
      UI.loadApp();

    };
})();

/*
  Init
*/
window.onload = function () {
  UI.showApp();
};